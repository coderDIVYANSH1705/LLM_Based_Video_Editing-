# AI Reel Optimizer - Design Document

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│                     (Next.js 14 + React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Upload Page  │  │  Dashboard   │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│                    (FastAPI + Python)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Upload API   │  │ Analyze API  │  │  Health API  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Processing Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Video Analyzer│  │Audio Analyzer│  │Content Analyz│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │Thumbnail Gen │  │  LLM Service │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenCV     │  │   Librosa    │  │   Whisper    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                            │
│  │    Ollama    │  (LLaMA 3.1 / Mixtral)                    │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Interaction Flow

```
User Upload Video
      │
      ▼
Frontend Validation
      │
      ▼
POST /api/analyze
      │
      ├─► Video Analyzer ──► Video Metrics
      │
      ├─► Audio Analyzer ──► Audio Metrics
      │
      ├─► Content Analyzer ──► Transcript
      │
      ├─► LLM Service ──────► AI Suggestions
      │                       ├─► Music Recommendations
      │                       ├─► Hashtag Suggestions
      │                       └─► Title Suggestions
      │
      └─► Thumbnail Suggester ──► Thumbnail Frames
      │
      ▼
JSON Response
      │
      ▼
Results Dashboard
```



## 2. Backend Design

### 2.1 API Endpoints

#### 2.1.1 Root Endpoint
```
GET /
Response: {"message": "AI Reel Optimizer API", "status": "running"}
```

#### 2.1.2 Health Check
```
GET /health
Response: {"status": "healthy", "llm_provider": "ollama"}
```

#### 2.1.3 Video Analysis
```
POST /api/analyze
Content-Type: multipart/form-data

Request:
  - video: File (video file, max 100MB, ≤60s)
  - platform: string ("instagram" | "youtube_shorts" | "other")

Response: {
  "platform": string,
  "overall_score": number (0-10),
  "video": {
    "score": number (0-10),
    "issues": string[],
    "suggestions": string[]
  },
  "audio": {
    "score": number (0-10),
    "issues": string[],
    "suggestions": string[]
  },
  "content": {
    "score": number (0-10),
    "hook_score": number (0-10),
    "has_cta": boolean,
    "issues": string[],
    "suggestions": string[]
  },
  "top_3_priorities": string[],
  "music_recommendation": {
    "genre": string,
    "mood": string,
    "bpm_range": string,
    "vocals_preference": string,
    "energy_level": string,
    "reasoning": string,
    "search_keywords": string[],
    "best_for": string
  },
  "hashtag_suggestions": string[],
  "title_suggestions": string[],
  "thumbnail_suggestions": [{
    "timestamp": number,
    "score": number,
    "preview_image": string (base64),
    "reasoning": string,
    "is_recommended": boolean,
    "quality_metrics": {
      "sharpness": number,
      "brightness": number,
      "contrast": number,
      "face_detected": boolean,
      "face_count": number,
      "composition_score": number,
      "color_vibrancy": number
    }
  }]
}
```

### 2.2 Service Layer Architecture

#### 2.2.1 VideoAnalyzer Service
```python
class VideoAnalyzer:
    def __init__(self, video_path: str)
    def analyze(self) -> dict
    
    Private Methods:
    - _get_duration() -> float
    - _get_resolution() -> dict
    - _get_fps() -> float
    - _analyze_brightness() -> dict
    - _analyze_blur() -> float
    - _detect_scene_changes() -> int
    - _analyze_first_frame() -> dict
```

**Metrics Generated**:
- Duration (seconds)
- Resolution (width x height)
- FPS (frames per second)
- Brightness (average, is_dark, is_bright)
- Blur score (Laplacian variance)
- Scene changes count
- First frame quality (hook analysis)



#### 2.2.2 AudioAnalyzer Service
```python
class AudioAnalyzer:
    def __init__(self, video_path: str)
    def analyze(self) -> dict
    
    Private Methods:
    - _extract_audio() -> str
    - _analyze_loudness(y: np.ndarray) -> dict
    - _detect_silence_gaps(audio_path: str) -> list
    - _estimate_noise(y: np.ndarray) -> dict
    - _is_silent_or_low_audio(loudness_data: dict) -> bool
```

**Metrics Generated**:
- Duration (seconds)
- Sample rate (Hz)
- Loudness (average_db, is_too_quiet, is_too_loud)
- Silence gaps (start, end timestamps)
- Noise level (spectral_flatness, has_noise)
- Has audio (boolean)
- Is silent or low (boolean, <-40dB)

#### 2.2.3 ContentAnalyzer Service
```python
class ContentAnalyzer:
    def __init__(self, video_path: str)
    def transcribe(self) -> dict
    
    Private Methods:
    - _extract_audio() -> str
```

**Metrics Generated**:
- Text (full transcription)
- Segments (timestamped text segments)
- Language (detected language)

#### 2.2.4 LLMService
```python
class LLMService:
    def __init__(self)
    def generate_suggestions(...) -> dict
    
    Private Methods:
    - _build_prompt(...) -> str
    - _call_ollama(prompt: str) -> dict
    - _get_fallback_response(error_msg: str) -> dict
    - _generate_music_recommendation(...) -> dict
    - _generate_content_suggestions(...) -> dict
```

**Responsibilities**:
- Generate overall analysis and scores
- Create platform-specific suggestions
- Generate music recommendations
- Generate hashtag suggestions
- Generate title suggestions
- Handle LLM failures with fallbacks



#### 2.2.5 ThumbnailSuggester Service
```python
class ThumbnailSuggester:
    def __init__(self, video_path: str, platform: str)
    def generate_suggestions(num_suggestions: int = 5) -> list
    
    Private Methods:
    - _extract_frames() -> list
    - _score_frame(frame, timestamp) -> dict
    - _calculate_sharpness(frame) -> float
    - _calculate_brightness(frame) -> float
    - _calculate_contrast(frame) -> float
    - _detect_faces(frame) -> tuple
    - _calculate_composition_score(frame) -> float
    - _calculate_color_vibrancy(frame) -> float
    - _has_text_overlay(frame) -> bool
    - _calculate_final_score(metrics) -> float
    - _generate_preview_image(frame) -> str
    - _generate_reasoning(metrics, timestamp) -> str
```

**Scoring Weights by Platform**:
- **Instagram**: Faces (0.35), Composition (0.25), Vibrancy (0.20), Sharpness (0.10), Brightness (0.05), Contrast (0.05)
- **YouTube Shorts**: Faces (0.30), Composition (0.25), Vibrancy (0.20), Sharpness (0.15), Brightness (0.05), Contrast (0.05)
- **Other**: Balanced weights across all metrics

### 2.3 Data Flow

#### 2.3.1 Video Upload Flow
```
1. User selects video file
2. Frontend validates:
   - File type (video/*)
   - File size (<100MB)
   - Duration (≤60s, client-side estimate)
3. Upload to /api/analyze with platform
4. Backend validates:
   - File type
   - Platform value
5. Save to temporary directory
6. Process video
7. Delete temporary file
8. Return results
```

#### 2.3.2 Analysis Pipeline
```
1. Initialize all analyzers
2. Run analyses in sequence:
   a. Video analysis (5s)
   b. Audio analysis (3s)
   c. Content transcription (10s)
   d. LLM suggestions (10s)
      - Music recommendations (3-5s)
      - Hashtag/title suggestions (3-5s)
   e. Thumbnail generation (2s)
3. Combine all results
4. Return JSON response
Total: ~30 seconds
```

### 2.4 Error Handling Strategy

#### 2.4.1 Graceful Degradation
- If video analysis fails → Return partial results
- If audio analysis fails → Continue with video/content
- If transcription fails → Continue with empty transcript
- If LLM fails → Use fallback suggestions
- If thumbnail generation fails → Return empty array

#### 2.4.2 Fallback Mechanisms
```python
# LLM Fallback
if ollama_fails:
    return structured_fallback_response()

# Music Recommendation Fallback
if music_generation_fails:
    return pacing_based_recommendation()

# Hashtag/Title Fallback
if content_generation_fails:
    return platform_generic_suggestions()
```



## 3. Frontend Design

### 3.1 Component Architecture

```
app/
├── layout.tsx (Root layout)
├── page.tsx (Main page)
└── globals.css (Global styles)

components/
├── UploadSection.tsx (Video upload UI)
├── FunLoadingAnimation.tsx (Loading state)
├── ResultsDashboard.tsx (Main results display)
├── MusicRecommendationCard.tsx (Music suggestions)
├── HashtagTitleSuggestions.tsx (Hashtags & titles)
└── ThumbnailGallery.tsx (Thumbnail suggestions)
```

### 3.2 Component Specifications

#### 3.2.1 UploadSection Component
**Purpose**: Handle video upload and platform selection

**Props**: None (manages own state)

**State**:
- `selectedFile`: File | null
- `platform`: string
- `isUploading`: boolean
- `error`: string | null

**Features**:
- Drag-and-drop upload
- File browser upload
- Platform selection (Instagram, YouTube Shorts, Other)
- File validation
- Upload progress indicator
- Error display

#### 3.2.2 FunLoadingAnimation Component
**Purpose**: Engaging loading state during analysis

**Props**:
- `message`: string (optional)

**Features**:
- Animated spinner/loader
- Progress messages
- Estimated time remaining
- Fun facts or tips

#### 3.2.3 ResultsDashboard Component
**Purpose**: Display all analysis results

**Props**:
- `results`: AnalysisResults
- `onReset`: () => void

**Features**:
- Overall score display (hero section)
- Top 3 priorities
- Music recommendation card
- Hashtag/title suggestions
- Thumbnail gallery
- Detailed score cards (Video, Audio, Content)
- "Analyze Another" button



#### 3.2.4 MusicRecommendationCard Component
**Purpose**: Display AI-generated music recommendations

**Props**:
- `recommendation`: MusicRecommendation

**Features**:
- Genre, mood, BPM display
- Energy level indicator (animated)
- Vocals preference
- Reasoning explanation
- Search keywords (clickable)
- "Best for" platform badge
- Gradient design with glow effects

#### 3.2.5 HashtagTitleSuggestions Component
**Purpose**: Display hashtag and title suggestions

**Props**:
- `hashtags`: string[]
- `titles`: string[]

**Features**:
- 5 hashtag tags (clickable to copy)
- "Copy All" button for hashtags
- 3 title options with copy buttons
- Visual feedback on copy (checkmark)
- Info tooltips
- Side-by-side layout (hashtags left, titles right)

#### 3.2.6 ThumbnailGallery Component
**Purpose**: Display and manage thumbnail suggestions

**Props**:
- `thumbnails`: ThumbnailSuggestion[]

**Features**:
- Grid of 5 thumbnails
- Large preview of selected thumbnail
- Recommended badge (star icon)
- Score display (color-coded)
- Quality metrics display
- Face detection indicator
- Timestamp display
- Individual download buttons
- "Download All" button
- Reasoning explanation

### 3.3 State Management

#### 3.3.1 Main Page State
```typescript
interface PageState {
  step: 'upload' | 'analyzing' | 'results'
  results: AnalysisResults | null
  error: string | null
}
```

#### 3.3.2 Analysis Results Type
```typescript
interface AnalysisResults {
  platform: string
  overall_score: number
  video: CategoryScore
  audio: CategoryScore
  content: ContentScore
  top_3_priorities: string[]
  music_recommendation: MusicRecommendation
  hashtag_suggestions: string[]
  title_suggestions: string[]
  thumbnail_suggestions: ThumbnailSuggestion[]
}

interface CategoryScore {
  score: number
  issues: string[]
  suggestions: string[]
}

interface ContentScore extends CategoryScore {
  hook_score: number
  has_cta: boolean
}

interface MusicRecommendation {
  genre: string
  mood: string
  bpm_range: string
  vocals_preference: string
  energy_level: string
  reasoning: string
  search_keywords: string[]
  best_for: string
}

interface ThumbnailSuggestion {
  timestamp: number
  score: number
  preview_image: string
  reasoning: string
  is_recommended: boolean
  quality_metrics: QualityMetrics
}
```



### 3.4 UI/UX Design Principles

#### 3.4.1 Visual Design
- **Color Scheme**: Dark theme with gradient accents
  - Background: Slate-900 (#0f172a)
  - Cards: Slate-800/50 with backdrop blur
  - Accents: Gradient combinations (violet, fuchsia, cyan, indigo, purple, pink)
- **Typography**: System fonts, clear hierarchy
- **Spacing**: Consistent 8px grid system
- **Borders**: Subtle white/10 opacity borders
- **Shadows**: Glow effects using gradients and blur

#### 3.4.2 Interaction Design
- **Hover States**: Scale transforms, opacity changes
- **Click Feedback**: Visual confirmation (checkmarks, color changes)
- **Loading States**: Animated spinners, progress indicators
- **Transitions**: Smooth 200-300ms transitions
- **Animations**: Subtle entrance animations, pulse effects

#### 3.4.3 Responsive Design
- **Mobile**: Single column layout, stacked cards
- **Tablet**: 2-column grid for some sections
- **Desktop**: Full 3-column grid, side-by-side layouts
- **Breakpoints**: Tailwind default (sm: 640px, md: 768px, lg: 1024px)

### 3.5 Accessibility

#### 3.5.1 WCAG Compliance
- **Color Contrast**: Minimum 4.5:1 for text
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Semantic HTML, ARIA labels
- **Focus Indicators**: Visible focus states

#### 3.5.2 User Feedback
- **Loading States**: Clear progress indicators
- **Error Messages**: User-friendly, actionable
- **Success States**: Visual confirmation
- **Empty States**: Helpful guidance



## 4. AI/ML Design

### 4.1 LLM Integration (Ollama)

#### 4.1.1 Model Selection
- **Primary**: LLaMA 3.1 8B
- **Alternative**: Mixtral
- **Rationale**: Balance between quality and speed, local deployment

#### 4.1.2 Prompt Engineering

**Main Analysis Prompt Structure**:
```
You are an expert video optimization AI for {platform}.

Analyze this video and provide actionable suggestions in JSON format.

VIDEO METRICS:
- Duration, Resolution, Brightness, Blur, Scene Changes, First Frame Quality

AUDIO METRICS:
- Loudness, Silence Gaps, Noise Level

TRANSCRIPT:
{transcribed_text}

PLATFORM RULES ({platform}):
- Optimal Duration, Aspect Ratio, Hook Time, CTA Placement

Provide response in EXACT JSON format:
{
  "platform": string,
  "overall_score": number,
  "video": {...},
  "audio": {...},
  "content": {...},
  "top_3_priorities": [...]
}
```

**Music Recommendation Prompt**:
```
You are a music expert for {platform} content.

Recommend background music that would complement this video.

VIDEO ANALYSIS:
- Duration, Scene Changes, Pacing, Brightness, Platform, Audio Level

Provide music recommendation in EXACT JSON format:
{
  "genre": string,
  "mood": string,
  "bpm_range": string,
  "vocals_preference": string,
  "energy_level": string,
  "reasoning": string,
  "search_keywords": [...],
  "best_for": string
}
```

**Content Suggestions Prompt**:
```
You are a {platform} content expert.

Generate engaging hashtags and video titles for this content.

VIDEO ANALYSIS:
- Duration, Scene Changes, Pacing, Brightness, Platform, Transcript

Provide suggestions in EXACT JSON format:
{
  "hashtags": ["#tag1", "#tag2", ...],
  "titles": ["Title 1", "Title 2", "Title 3"]
}
```

#### 4.1.3 Response Parsing
- Extract JSON from markdown code blocks
- Validate required fields
- Handle malformed responses
- Fallback to structured defaults



### 4.2 Computer Vision (OpenCV)

#### 4.2.1 Video Analysis Algorithms

**Brightness Analysis**:
```python
# Convert to grayscale
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
# Calculate mean brightness
brightness = np.mean(gray)
# Classify: dark (<80), normal (80-180), bright (>180)
```

**Blur Detection**:
```python
# Laplacian variance method
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
# Higher variance = sharper image
# Threshold: >100 is sharp
```

**Scene Change Detection**:
```python
# Frame difference method
diff = cv2.absdiff(prev_frame, current_frame)
mean_diff = np.mean(diff)
# Threshold: >30 indicates scene change
```

**Face Detection**:
```python
# Haar Cascade classifier
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
faces = face_cascade.detectMultiScale(gray, 1.1, 4)
# Returns: (x, y, w, h) for each face
```

#### 4.2.2 Thumbnail Scoring Algorithm

**Sharpness Score** (0-100):
```python
laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
sharpness = min(100, (laplacian_var / 10) * 100)
```

**Brightness Score** (0-100):
```python
brightness = np.mean(gray)
# Optimal range: 100-150
if 100 <= brightness <= 150:
    score = 100
else:
    score = 100 - abs(brightness - 125) / 1.25
```

**Composition Score** (0-100):
```python
# Rule of thirds: divide frame into 9 parts
# Check if interesting features align with intersection points
# Higher score if faces/objects at power points
```

**Color Vibrancy Score** (0-100):
```python
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
saturation = hsv[:, :, 1]
vibrancy = np.mean(saturation) / 2.55  # Normalize to 0-100
```

**Final Score Calculation**:
```python
final_score = (
    sharpness * weight_sharpness +
    brightness * weight_brightness +
    contrast * weight_contrast +
    face_score * weight_faces +
    composition * weight_composition +
    vibrancy * weight_vibrancy
)
```



### 4.3 Audio Processing (Librosa)

#### 4.3.1 Loudness Analysis
```python
# RMS (Root Mean Square) energy
rms = librosa.feature.rms(y=audio_signal)[0]
avg_rms = np.mean(rms)

# Convert to decibels
db = 20 * np.log10(avg_rms) if avg_rms > 0 else -100

# Classification:
# Too quiet: < -30 dB
# Optimal: -30 to -10 dB
# Too loud: > -10 dB
# Silent/Low: < -40 dB
```

#### 4.3.2 Noise Estimation
```python
# Spectral flatness (Wiener entropy)
spectral_flatness = librosa.feature.spectral_flatness(y=audio_signal)[0]
avg_flatness = np.mean(spectral_flatness)

# Interpretation:
# Low flatness (< 0.3): Tonal (music, speech)
# High flatness (> 0.5): Noisy (white noise, hiss)
```

#### 4.3.3 Silence Detection
```python
# Using pydub
silences = detect_silence(
    audio_segment,
    min_silence_len=500,  # 500ms minimum
    silence_thresh=-40    # -40 dB threshold
)
# Returns: [(start_ms, end_ms), ...]
```

### 4.4 Speech Recognition (Whisper)

#### 4.4.1 Model Configuration
- **Model Size**: Base (74M parameters)
- **Rationale**: Balance between speed and accuracy
- **Language**: Auto-detect
- **Task**: Transcribe

#### 4.4.2 Transcription Process
```python
model = whisper.load_model("base")
result = model.transcribe(audio_path)

# Output:
{
  "text": "Full transcription...",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Segment text..."
    }
  ],
  "language": "en"
}
```



## 5. Platform-Specific Rules

### 5.1 Instagram Reels

**Optimal Specifications**:
- Duration: 15-30 seconds
- Aspect Ratio: 9:16 (vertical)
- Resolution: 1080x1920
- Hook Time: First 3 seconds critical
- CTA Placement: Last 5 seconds

**Scoring Weights**:
- Hook Quality: 30%
- Visual Quality: 25%
- Audio Quality: 20%
- Content Clarity: 15%
- CTA Presence: 10%

**Thumbnail Weights**:
- Faces: 35%
- Composition: 25%
- Color Vibrancy: 20%
- Sharpness: 10%
- Brightness: 5%
- Contrast: 5%

### 5.2 YouTube Shorts

**Optimal Specifications**:
- Duration: 30-60 seconds
- Aspect Ratio: 9:16 (vertical)
- Resolution: 1080x1920
- Hook Time: First 5 seconds
- CTA Placement: Throughout + end

**Scoring Weights**:
- Hook Quality: 25%
- Visual Quality: 25%
- Audio Quality: 20%
- Content Clarity: 20%
- CTA Presence: 10%

**Thumbnail Weights**:
- Faces: 30%
- Composition: 25%
- Color Vibrancy: 20%
- Sharpness: 15%
- Brightness: 5%
- Contrast: 5%

### 5.3 Other Platforms

**Optimal Specifications**:
- Duration: 15-60 seconds (flexible)
- Aspect Ratio: Flexible
- Hook Time: First 3-5 seconds
- CTA Placement: End

**Scoring Weights**:
- Balanced across all categories

**Thumbnail Weights**:
- Balanced across all metrics



## 6. Database Design (Future)

### 6.1 Schema (Planned)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    video_filename VARCHAR(255),
    platform VARCHAR(50),
    overall_score DECIMAL(3,1),
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY,
    analysis_id UUID REFERENCES analyses(id),
    metric_name VARCHAR(100),
    metric_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 Current Storage (MVP)

**Temporary File Storage**:
- Location: `backend/uploads/`
- Naming: `temp_{original_filename}`
- Lifecycle: Created on upload, deleted after analysis
- No persistent storage

**Future Enhancements**:
- User authentication
- Analysis history
- Performance tracking
- A/B testing results



## 7. Security Design

### 7.1 Input Validation

#### 7.1.1 File Upload Security
```python
# File type validation
allowed_types = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"]
if file.content_type not in allowed_types:
    raise HTTPException(400, "Invalid file type")

# File size validation
MAX_SIZE = 100 * 1024 * 1024  # 100MB
if file.size > MAX_SIZE:
    raise HTTPException(400, "File too large")

# Filename sanitization
safe_filename = secure_filename(file.filename)
```

#### 7.1.2 Platform Validation
```python
ALLOWED_PLATFORMS = ["instagram", "youtube_shorts", "other"]
if platform not in ALLOWED_PLATFORMS:
    raise HTTPException(400, "Invalid platform")
```

### 7.2 CORS Configuration
```python
CORSMiddleware(
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

### 7.3 Data Privacy

**Principles**:
- No permanent storage of user videos
- Immediate deletion after analysis
- No user tracking (MVP)
- No third-party data sharing

**Implementation**:
```python
try:
    # Process video
    results = analyze_video(video_path)
    return results
finally:
    # Always cleanup
    if video_path.exists():
        video_path.unlink()
```

### 7.4 Rate Limiting (Future)

**Planned Implementation**:
- 10 requests per minute per IP
- 100 requests per hour per IP
- Exponential backoff for repeated violations



## 8. Performance Optimization

### 8.1 Backend Optimizations

#### 8.1.1 Video Processing
- **Frame Sampling**: Analyze every Nth frame instead of all frames
- **Resolution Downscaling**: Process at lower resolution for analysis
- **Lazy Loading**: Load ML models only when needed
- **Parallel Processing**: Run independent analyses concurrently (future)

#### 8.1.2 Memory Management
```python
# Release video capture
cap.release()

# Delete temporary files immediately
os.remove(temp_file)

# Clear large arrays
del large_array
gc.collect()
```

#### 8.1.3 Caching Strategy (Future)
- Cache Whisper model in memory
- Cache Ollama responses for similar videos
- Cache thumbnail frames

### 8.2 Frontend Optimizations

#### 8.2.1 Code Splitting
```typescript
// Lazy load heavy components
const ResultsDashboard = dynamic(() => import('./ResultsDashboard'))
const ThumbnailGallery = dynamic(() => import('./ThumbnailGallery'))
```

#### 8.2.2 Image Optimization
- Base64 thumbnails for instant display
- Lazy loading for off-screen images
- Responsive image sizes

#### 8.2.3 Bundle Optimization
- Tree shaking unused code
- Minification and compression
- CDN for static assets (future)

### 8.3 API Optimization

#### 8.3.1 Response Compression
```python
# Enable gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

#### 8.3.2 Streaming Responses (Future)
- Stream analysis results as they complete
- WebSocket for real-time updates
- Progress indicators



## 9. Testing Strategy

### 9.1 Backend Testing

#### 9.1.1 Unit Tests
```python
# Test video analyzer
def test_video_analyzer_duration():
    analyzer = VideoAnalyzer("test_video.mp4")
    metrics = analyzer.analyze()
    assert metrics['duration'] > 0
    assert metrics['duration'] <= 60

# Test audio analyzer
def test_audio_loudness_detection():
    analyzer = AudioAnalyzer("test_video.mp4")
    metrics = analyzer.analyze()
    assert 'loudness' in metrics
    assert 'average_db' in metrics['loudness']

# Test LLM service
def test_llm_fallback():
    service = LLMService()
    # Mock Ollama failure
    response = service._get_fallback_response("Test error")
    assert 'overall_score' in response
    assert response['overall_score'] == 5.0
```

#### 9.1.2 Integration Tests
```python
# Test full analysis pipeline
def test_full_analysis():
    response = client.post(
        "/api/analyze",
        files={"video": open("test_video.mp4", "rb")},
        data={"platform": "instagram"}
    )
    assert response.status_code == 200
    data = response.json()
    assert 'overall_score' in data
    assert 'music_recommendation' in data
    assert 'hashtag_suggestions' in data
```

### 9.2 Frontend Testing

#### 9.2.1 Component Tests
```typescript
// Test upload component
test('UploadSection validates file type', () => {
    const { getByText } = render(<UploadSection />)
    // Upload invalid file
    // Assert error message displayed
})

// Test results dashboard
test('ResultsDashboard displays scores', () => {
    const mockResults = { overall_score: 8.5, ... }
    const { getByText } = render(<ResultsDashboard results={mockResults} />)
    expect(getByText('8.5')).toBeInTheDocument()
})
```

#### 9.2.2 E2E Tests (Future)
- Cypress or Playwright
- Full user flow testing
- Cross-browser testing

### 9.3 Performance Testing

#### 9.3.1 Load Testing
- Test with multiple concurrent uploads
- Measure response times
- Identify bottlenecks

#### 9.3.2 Stress Testing
- Test with maximum file sizes
- Test with corrupted files
- Test with edge cases



## 10. Deployment Architecture

### 10.1 Development Environment

```
┌─────────────────────────────────────────┐
│         Developer Machine               │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Frontend   │  │   Backend    │   │
│  │ localhost:   │  │ localhost:   │   │
│  │    3000      │  │    8000      │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  ┌──────────────┐                      │
│  │   Ollama     │                      │
│  │ localhost:   │                      │
│  │   11434      │                      │
│  └──────────────┘                      │
└─────────────────────────────────────────┘
```

**Setup Commands**:
```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

### 10.2 Production Architecture (Future)

```
┌─────────────────────────────────────────┐
│            Load Balancer                │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌───────▼────────┐
│  Frontend      │  │  Frontend      │
│  (Vercel)      │  │  (Vercel)      │
└────────────────┘  └────────────────┘
        │                   │
        └─────────┬─────────┘
                  │
┌─────────────────▼─────────────────┐
│         API Gateway               │
└─────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌───────▼────────┐
│  Backend       │  │  Backend       │
│  (Docker)      │  │  (Docker)      │
└────────────────┘  └────────────────┘
        │                   │
        └─────────┬─────────┘
                  │
┌─────────────────▼─────────────────┐
│         Ollama Service            │
│         (GPU Instance)            │
└─────────────────────────────────────┘
```

### 10.3 Docker Configuration (Future)

**Backend Dockerfile**:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Docker Compose**:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_HOST=ollama:11434
    depends_on:
      - ollama
  
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

volumes:
  ollama_data:
```



## 11. Monitoring and Logging

### 11.1 Logging Strategy

#### 11.1.1 Backend Logging
```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Log levels:
# DEBUG: Detailed diagnostic information
# INFO: General informational messages
# WARNING: Warning messages
# ERROR: Error messages
# CRITICAL: Critical errors
```

**Log Events**:
- Video upload received
- Analysis started/completed
- Each analyzer execution time
- LLM requests and responses
- Errors and exceptions
- File cleanup operations

#### 11.1.2 Frontend Logging
```typescript
// Console logging for development
console.log('🔍 ResultsDashboard received:', data)
console.error('❌ Upload failed:', error)

// Future: Send to analytics service
analytics.track('video_analyzed', {
  platform: platform,
  duration: duration,
  overall_score: score
})
```

### 11.2 Metrics Collection (Future)

**Key Metrics**:
- Request count per endpoint
- Average response time
- Error rate
- Analysis completion rate
- User satisfaction scores

**Tools**:
- Prometheus for metrics collection
- Grafana for visualization
- Sentry for error tracking

### 11.3 Health Monitoring

**Health Check Endpoint**:
```python
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "llm_provider": os.getenv("LLM_PROVIDER"),
        "timestamp": datetime.now().isoformat()
    }
```

**Monitoring Checks**:
- API responsiveness
- Ollama connectivity
- Disk space availability
- Memory usage
- CPU usage



## 12. Future Enhancements

### 12.1 Phase 2 Features

#### 12.1.1 User Authentication
- Email/password authentication
- OAuth (Google, GitHub)
- JWT token-based sessions
- User profiles

#### 12.1.2 Analysis History
- Save analysis results
- View past analyses
- Compare analyses
- Export reports

#### 12.1.3 Batch Processing
- Upload multiple videos
- Queue-based processing
- Progress tracking
- Bulk export

### 12.2 Phase 3 Features

#### 12.2.1 Auto-Edit Mode
- Automatic video trimming
- Caption generation
- Color grading
- Audio enhancement
- Transition effects

#### 12.2.2 Advanced Analytics
- Engagement predictions
- Trend analysis
- Competitor benchmarking
- A/B testing framework

#### 12.2.3 Multi-Language Support
- Hindi transcription
- Hinglish support
- Regional languages
- Multi-language UI

### 12.3 Phase 4 Features

#### 12.3.1 Mobile Application
- React Native app
- On-device processing
- Camera integration
- Direct social media posting

#### 12.3.2 Brand Intelligence
- Logo detection
- Brand color analysis
- Compliance checking
- Brand consistency scoring

#### 12.3.3 Collaboration Features
- Team workspaces
- Shared analyses
- Comments and feedback
- Approval workflows



## 13. Technical Decisions and Rationale

### 13.1 Why FastAPI?
- **Performance**: Async support, high throughput
- **Developer Experience**: Auto-generated docs, type hints
- **Modern**: Built on Starlette and Pydantic
- **Ecosystem**: Great Python ML/AI library support

### 13.2 Why Next.js?
- **Performance**: Server-side rendering, code splitting
- **Developer Experience**: File-based routing, hot reload
- **React Ecosystem**: Large component library
- **Production Ready**: Built-in optimizations

### 13.3 Why Ollama?
- **Local-First**: No API costs, data privacy
- **Performance**: Optimized for local inference
- **Flexibility**: Multiple model support
- **Open Source**: Community-driven, transparent

### 13.4 Why OpenCV?
- **Industry Standard**: Widely used, well-documented
- **Comprehensive**: All video processing needs
- **Performance**: Optimized C++ backend
- **Free**: Open source, no licensing costs

### 13.5 Why Whisper?
- **Accuracy**: State-of-the-art transcription
- **Local**: No API calls, data privacy
- **Multi-Language**: Supports 99 languages
- **Open Source**: Free, transparent

### 13.6 Why Tailwind CSS?
- **Utility-First**: Rapid development
- **Customizable**: Easy theming
- **Performance**: Purges unused CSS
- **Modern**: Industry standard



## 14. Constraints and Limitations

### 14.1 Current Limitations

#### 14.1.1 Technical Constraints
- **Video Duration**: Maximum 60 seconds
- **File Size**: Maximum 100MB
- **Processing Time**: ~30 seconds per video
- **Concurrent Users**: Limited by single-server capacity
- **Storage**: No persistent storage (temporary only)

#### 14.1.2 Feature Limitations
- **No Auto-Edit**: Manual editing required
- **No Social Integration**: No direct posting
- **No User Accounts**: No authentication (MVP)
- **No History**: No analysis tracking
- **Single Language UI**: English only

#### 14.1.3 Platform Limitations
- **Local Deployment**: Requires local Ollama
- **GPU Optional**: Works on CPU but slower
- **Internet Required**: For frontend assets
- **Modern Browsers**: Latest 2 versions only

### 14.2 Known Issues

#### 14.2.1 Performance Issues
- **First Analysis Slow**: Model loading time
- **Large Files**: Slower processing
- **Concurrent Requests**: May queue

#### 14.2.2 Accuracy Issues
- **Face Detection**: May miss side profiles
- **Transcription**: Accuracy varies with audio quality
- **LLM Suggestions**: May be generic for some videos

### 14.3 Future Improvements

#### 14.3.1 Performance
- Implement caching
- Add queue system
- Optimize model loading
- Add GPU acceleration

#### 14.3.2 Accuracy
- Fine-tune models
- Improve prompts
- Add user feedback loop
- Implement A/B testing

#### 14.3.3 Features
- Add user authentication
- Implement history tracking
- Add batch processing
- Enable social integration



## 15. Glossary of Technical Terms

### 15.1 Video Processing
- **Frame**: Single image in a video sequence
- **FPS**: Frames Per Second, video playback speed
- **Resolution**: Video dimensions (width x height)
- **Aspect Ratio**: Proportional relationship between width and height
- **Codec**: Algorithm for encoding/decoding video
- **Bitrate**: Amount of data processed per second

### 15.2 Audio Processing
- **Sample Rate**: Number of audio samples per second (Hz)
- **RMS**: Root Mean Square, measure of audio level
- **dB**: Decibel, logarithmic unit of sound intensity
- **LUFS**: Loudness Units relative to Full Scale
- **Spectral Flatness**: Measure of noise vs tonal content

### 15.3 Machine Learning
- **LLM**: Large Language Model
- **Inference**: Running a trained model on new data
- **Prompt Engineering**: Crafting effective prompts for LLMs
- **Embedding**: Vector representation of data
- **Fine-tuning**: Adapting a pre-trained model

### 15.4 Computer Vision
- **Grayscale**: Image with only brightness information
- **Laplacian**: Edge detection operator
- **Haar Cascade**: Object detection algorithm
- **HSV**: Hue, Saturation, Value color space
- **ROI**: Region of Interest

### 15.5 Web Development
- **REST**: Representational State Transfer API architecture
- **CORS**: Cross-Origin Resource Sharing
- **SSR**: Server-Side Rendering
- **CSR**: Client-Side Rendering
- **JWT**: JSON Web Token for authentication

---

## Document Metadata

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Complete - Production Design  
**Authors**: AI Reel Optimizer Team  
**Review Status**: Approved for Implementation

---

## Appendix A: API Response Examples

### A.1 Successful Analysis Response
```json
{
  "platform": "instagram",
  "overall_score": 7.8,
  "video": {
    "score": 8.2,
    "issues": ["Slight blur detected in frames 10-15"],
    "suggestions": ["Stabilize camera or use tripod", "Increase sharpness in post-processing"]
  },
  "audio": {
    "score": 7.5,
    "issues": ["Background noise detected", "Loudness slightly low"],
    "suggestions": ["Apply noise reduction filter", "Normalize audio to -16 LUFS"]
  },
  "content": {
    "score": 7.6,
    "hook_score": 6.5,
    "has_cta": false,
    "issues": ["Hook could be stronger", "No clear call-to-action"],
    "suggestions": ["Start with a question or bold statement", "Add CTA in last 5 seconds"]
  },
  "top_3_priorities": [
    "Strengthen hook in first 3 seconds",
    "Add clear call-to-action at end",
    "Reduce background noise in audio"
  ],
  "music_recommendation": {
    "genre": "Lo-fi Instrumental",
    "mood": "Calm, Professional",
    "bpm_range": "~95 BPM",
    "vocals_preference": "Instrumental only",
    "energy_level": "Medium",
    "reasoning": "Your video's moderate pacing pairs well with lo-fi music",
    "search_keywords": ["royalty free lofi", "no copyright chill music"],
    "best_for": "Instagram Reels"
  },
  "hashtag_suggestions": [
    "#instagramreels",
    "#contentcreator",
    "#videotips",
    "#socialmedia",
    "#viral"
  ],
  "title_suggestions": [
    "Transform Your Content with This Simple Trick",
    "The Secret to Viral Reels Revealed",
    "Watch This Before Posting Your Next Reel"
  ],
  "thumbnail_suggestions": [
    {
      "timestamp": 4.2,
      "score": 87.5,
      "preview_image": "data:image/jpeg;base64,...",
      "reasoning": "Sharp image with prominent face and good composition",
      "is_recommended": true,
      "quality_metrics": {
        "sharpness": 85.2,
        "brightness": 78.5,
        "contrast": 72.3,
        "face_detected": true,
        "face_count": 1,
        "composition_score": 68.4,
        "color_vibrancy": 82.1
      }
    }
  ]
}
```

### A.2 Error Response
```json
{
  "detail": "Analysis failed: Video file corrupted"
}
```

---

**End of Design Document**
