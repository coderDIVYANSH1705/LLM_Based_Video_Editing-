# AI Reel Optimizer - Requirements Document

## 1. Project Overview

### 1.1 Vision
Create an AI-powered video optimization platform that analyzes short-form videos (≤60 seconds) and provides actionable, platform-specific suggestions to maximize quality, clarity, and engagement - essentially "Grammarly for Short-Form Videos".

### 1.2 Target Users
- Content creators (Instagram, YouTube Shorts, TikTok)
- Social media managers
- Marketing professionals
- Students and aspiring creators
- Small businesses and brands

### 1.3 Core Value Proposition
- **Explainable AI feedback** before posting
- **Platform-specific optimization** (Instagram Reels, YouTube Shorts, etc.)
- **Actionable insights** with timestamps and specific recommendations
- **Free and local-first** approach (no paid APIs)

---

## 2. Functional Requirements

### 2.1 Video Upload & Validation

#### FR-2.1.1: Video Upload
- **Description**: Users can upload video files for analysis
- **Acceptance Criteria**:
  - Support common video formats (MP4, MOV, AVI, WebM)
  - Maximum file size: 100MB
  - Maximum duration: 60 seconds
  - Validate file type before processing
  - Display upload progress indicator
  - Handle upload errors gracefully

#### FR-2.1.2: Platform Selection
- **Description**: Users select target platform for optimization
- **Acceptance Criteria**:
  - Support platforms: Instagram Reels, YouTube Shorts, Other
  - Platform selection is mandatory
  - Platform-specific rules applied to analysis
  - Display platform-specific guidelines

### 2.2 Video Analysis

#### FR-2.2.1: Video Quality Metrics
- **Description**: Analyze video technical quality
- **Acceptance Criteria**:
  - Extract video duration, resolution, FPS
  - Analyze brightness levels (average, dark/bright detection)
  - Detect blur using Laplacian variance
  - Count scene changes (frame difference analysis)
  - Analyze first frame quality (hook analysis)
  - Generate quality score (0-10)

#### FR-2.2.2: Visual Analysis
- **Description**: Analyze visual composition and quality
- **Acceptance Criteria**:
  - Detect faces and face prominence
  - Analyze composition (rule of thirds)
  - Measure color vibrancy
  - Detect text overlays
  - Assess sharpness and contrast

### 2.3 Audio Analysis

#### FR-2.3.1: Audio Quality Metrics
- **Description**: Analyze audio technical quality
- **Acceptance Criteria**:
  - Measure loudness in dB (LUFS)
  - Detect silence gaps (>500ms)
  - Estimate background noise levels
  - Identify too quiet (<-30dB) or too loud (>-10dB) audio
  - Detect silent or low-audio videos (<-40dB)
  - Generate audio quality score (0-10)

#### FR-2.3.2: Audio Content Analysis
- **Description**: Analyze audio content characteristics
- **Acceptance Criteria**:
  - Distinguish between voice, music, and ambient sound
  - Detect audio balance issues
  - Identify audio artifacts or distortion

### 2.4 Content Analysis

#### FR-2.4.1: Speech Transcription
- **Description**: Convert speech to text using Whisper
- **Acceptance Criteria**:
  - Transcribe all spoken content
  - Provide timestamps for each segment
  - Detect language automatically
  - Handle multiple speakers
  - Support silent videos (no transcription)

#### FR-2.4.2: Content Intelligence
- **Description**: Analyze content quality and engagement factors
- **Acceptance Criteria**:
  - Score hook strength (first 3 seconds)
  - Detect call-to-action (CTA) presence
  - Analyze pacing and clarity
  - Assess platform relevance
  - Generate content score (0-10)

### 2.5 AI-Powered Suggestions

#### FR-2.5.1: LLM-Based Analysis
- **Description**: Use LLM to generate intelligent suggestions
- **Acceptance Criteria**:
  - Analyze all metrics holistically
  - Apply platform-specific rules
  - Generate overall score (0-10)
  - Provide top 3 priorities
  - Generate specific, actionable suggestions
  - Include timestamps where relevant

#### FR-2.5.2: Platform-Specific Optimization
- **Description**: Tailor suggestions to target platform
- **Acceptance Criteria**:
  - **Instagram Reels**: 15-30s optimal, 9:16 aspect ratio, first 3s hook critical
  - **YouTube Shorts**: 30-60s optimal, 9:16 aspect ratio, first 5s hook
  - **Other**: Flexible duration, aspect ratio, 3-5s hook
  - Apply platform-specific scoring weights
  - Reference platform best practices

### 2.6 Thumbnail Suggestions

#### FR-2.6.1: Thumbnail Generation
- **Description**: AI-powered thumbnail frame selection
- **Acceptance Criteria**:
  - Extract frames at 2-second intervals
  - Score frames on multiple metrics:
    - Sharpness (Laplacian variance)
    - Brightness and contrast
    - Face detection and prominence
    - Composition (rule of thirds)
    - Color vibrancy
  - Apply platform-specific weights
  - Select top 5 frames
  - Generate preview images (320x180, base64)
  - Mark recommended thumbnail
  - Provide reasoning for each selection

#### FR-2.6.2: Thumbnail Download
- **Description**: Allow users to download suggested thumbnails
- **Acceptance Criteria**:
  - Download individual thumbnails
  - Download all thumbnails at once
  - Include timestamp in filename
  - Support JPEG format

### 2.7 Music Recommendations

#### FR-2.7.1: Music Suggestion Generation
- **Description**: AI-powered background music recommendations
- **Acceptance Criteria**:
  - Generate recommendations for ALL videos
  - Analyze video pacing (scene changes per second)
  - Consider brightness and visual mood
  - Apply platform-specific music trends
  - Provide:
    - Genre (e.g., "Lo-fi Instrumental")
    - Mood (e.g., "Calm, Professional")
    - BPM range (e.g., "~95 BPM")
    - Vocals preference (Instrumental/Vocals OK/Avoid)
    - Energy level (High/Medium/Low)
    - Reasoning explanation
    - Search keywords for finding music
    - "Best for" platform indicator

#### FR-2.7.2: Music Search Integration
- **Description**: Help users find royalty-free music
- **Acceptance Criteria**:
  - Provide clickable search keywords
  - Open YouTube search in new tab
  - Include "royalty free" and "no copyright" in searches
  - Platform-specific search terms

### 2.8 Hashtag Suggestions

#### FR-2.8.1: Hashtag Generation
- **Description**: AI-powered hashtag recommendations
- **Acceptance Criteria**:
  - Generate 5 relevant hashtags
  - Mix popular and niche tags
  - Include platform-specific trending tags
  - Content-relevant tags
  - All hashtags start with #
  - No spaces in hashtags

#### FR-2.8.2: Hashtag Copy Functionality
- **Description**: Easy hashtag copying
- **Acceptance Criteria**:
  - Click individual hashtag to copy
  - "Copy All" button for all hashtags
  - Visual feedback on copy (checkmark)
  - Copy as space-separated string

### 2.9 Title Suggestions

#### FR-2.9.1: Title Generation
- **Description**: AI-powered video title recommendations
- **Acceptance Criteria**:
  - Generate 3 different title options
  - Hook viewers in first 3 words
  - Keep under 100 characters
  - Include keywords for discoverability
  - Create curiosity or value proposition
  - Platform-optimized

#### FR-2.9.2: Title Copy Functionality
- **Description**: Easy title copying
- **Acceptance Criteria**:
  - Copy button for each title
  - Visual feedback on copy (checkmark)
  - Copy exact title text

### 2.10 Results Dashboard

#### FR-2.10.1: Score Display
- **Description**: Visual representation of analysis results
- **Acceptance Criteria**:
  - Display overall score (0-10) prominently
  - Color-coded scores (green ≥8, yellow ≥6, red <6)
  - Score interpretation (Excellent/Good/Needs Optimization)
  - Animated score reveal

#### FR-2.10.2: Detailed Analysis Cards
- **Description**: Breakdown of video, audio, and content scores
- **Acceptance Criteria**:
  - Separate cards for Video, Audio, Content
  - Individual scores (0-10) for each category
  - List of issues found
  - List of actionable suggestions
  - Visual icons and color coding
  - Gradient glow effects

#### FR-2.10.3: Priority Recommendations
- **Description**: Top 3 most important improvements
- **Acceptance Criteria**:
  - Display top 3 priorities prominently
  - Numbered list (1, 2, 3)
  - Specific, actionable recommendations
  - Positioned above detailed analysis

---

## 3. Non-Functional Requirements

### 3.1 Performance

#### NFR-3.1.1: Analysis Speed
- **Requirement**: Complete analysis within 30 seconds for 60s video
- **Metrics**:
  - Video analysis: ≤5 seconds
  - Audio analysis: ≤3 seconds
  - Transcription: ≤10 seconds
  - LLM generation: ≤10 seconds
  - Thumbnail generation: ≤2 seconds

#### NFR-3.1.2: Upload Speed
- **Requirement**: Support fast video uploads
- **Metrics**:
  - Display upload progress
  - Handle network interruptions
  - Resume capability (future)

### 3.2 Reliability

#### NFR-3.2.1: Error Handling
- **Requirement**: Graceful error handling throughout
- **Acceptance Criteria**:
  - Validate inputs before processing
  - Catch and log all exceptions
  - Provide user-friendly error messages
  - Fallback suggestions if LLM fails
  - Continue analysis even if one component fails

#### NFR-3.2.2: Availability
- **Requirement**: System should be available 99% of the time
- **Acceptance Criteria**:
  - Handle concurrent users
  - Automatic recovery from failures
  - Health check endpoints

### 3.3 Usability

#### NFR-3.3.1: User Interface
- **Requirement**: Intuitive, modern, and responsive UI
- **Acceptance Criteria**:
  - Mobile-responsive design
  - Clear visual hierarchy
  - Consistent design language
  - Accessible color contrasts
  - Loading indicators for all async operations

#### NFR-3.3.2: User Experience
- **Requirement**: Smooth, engaging user experience
- **Acceptance Criteria**:
  - Animated transitions
  - Visual feedback for all actions
  - Clear progress indicators
  - Helpful tooltips and hints
  - Fun loading animations

### 3.4 Security

#### NFR-3.4.1: Data Privacy
- **Requirement**: Protect user data and videos
- **Acceptance Criteria**:
  - Delete uploaded videos after analysis
  - No permanent storage of user content
  - Secure file upload (validation)
  - CORS protection

#### NFR-3.4.2: Input Validation
- **Requirement**: Validate all user inputs
- **Acceptance Criteria**:
  - File type validation
  - File size limits
  - Duration limits
  - Platform selection validation

### 3.5 Scalability

#### NFR-3.5.1: Horizontal Scaling
- **Requirement**: Support multiple concurrent users
- **Acceptance Criteria**:
  - Stateless API design
  - Background task processing
  - Queue-based architecture (future)

#### NFR-3.5.2: Resource Management
- **Requirement**: Efficient resource utilization
- **Acceptance Criteria**:
  - Cleanup temporary files
  - Memory-efficient video processing
  - Lazy loading of ML models

### 3.6 Maintainability

#### NFR-3.6.1: Code Quality
- **Requirement**: Clean, maintainable codebase
- **Acceptance Criteria**:
  - Modular architecture
  - Clear separation of concerns
  - Type hints (Python) and TypeScript (Frontend)
  - Comprehensive error logging
  - Code comments for complex logic

#### NFR-3.6.2: Documentation
- **Requirement**: Comprehensive documentation
- **Acceptance Criteria**:
  - API documentation
  - Setup instructions
  - Feature documentation
  - Troubleshooting guides
  - Architecture diagrams

---

## 4. Technical Constraints

### 4.1 Technology Stack

#### Backend
- **Language**: Python 3.9+
- **Framework**: FastAPI
- **Video Processing**: OpenCV, FFmpeg
- **Audio Processing**: Librosa, Pydub
- **Speech-to-Text**: OpenAI Whisper (local)
- **LLM**: Ollama (LLaMA 3.1, Mixtral)

#### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (future)

### 4.2 Infrastructure
- **Deployment**: Local-first (development)
- **Storage**: Local filesystem (temporary)
- **LLM**: Local Ollama instance
- **No Cloud Dependencies**: All processing local

### 4.3 Platform Support
- **Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Operating Systems**: Windows, macOS, Linux
- **Mobile**: Responsive design (future native app)

---

## 5. Future Requirements (Out of Scope for MVP)

### 5.1 Auto-Edit Mode
- Automatic video trimming
- Auto-generated captions
- Color grading suggestions
- Audio enhancement

### 5.2 Multi-Language Support
- Hindi, Hinglish support
- Regional language support
- Multi-language transcription

### 5.3 Trend Analysis
- Viral pattern learning
- Trending music suggestions
- Hashtag trend analysis
- Competitor analysis

### 5.4 Creator Dashboard
- Historical analysis tracking
- Performance metrics over time
- A/B testing results
- Engagement predictions

### 5.5 Mobile Application
- React Native app
- On-device processing
- Camera integration
- Direct social media posting

### 5.6 Brand Intelligence
- Brand consistency checking
- Logo detection
- Brand color analysis
- Compliance checking

---

## 6. Success Metrics

### 6.1 User Engagement
- **Target**: 80% of users complete full analysis
- **Metric**: Completion rate

### 6.2 Suggestion Quality
- **Target**: 70% of suggestions rated as helpful
- **Metric**: User feedback ratings

### 6.3 Performance
- **Target**: 95% of analyses complete within 30 seconds
- **Metric**: Average analysis time

### 6.4 Accuracy
- **Target**: 85% accuracy in issue detection
- **Metric**: User validation of detected issues

### 6.5 User Satisfaction
- **Target**: 4.5/5 average rating
- **Metric**: User satisfaction surveys

---

## 7. Acceptance Criteria Summary

### 7.1 MVP Must-Haves
- ✅ Video upload (≤60s, common formats)
- ✅ Platform selection (Instagram, YouTube Shorts, Other)
- ✅ Video quality analysis (brightness, blur, scenes)
- ✅ Audio quality analysis (loudness, silence, noise)
- ✅ Speech transcription (Whisper)
- ✅ LLM-powered suggestions (Ollama)
- ✅ Overall score (0-10)
- ✅ Top 3 priorities
- ✅ Detailed analysis dashboard
- ✅ Thumbnail suggestions (5 frames)
- ✅ Music recommendations
- ✅ Hashtag suggestions (5 tags)
- ✅ Title suggestions (3 options)

### 7.2 MVP Nice-to-Haves
- ⚠️ Historical analysis tracking
- ⚠️ User accounts and authentication
- ⚠️ Export reports (PDF)
- ⚠️ Batch processing
- ⚠️ API rate limiting

### 7.3 Post-MVP Features
- 🔮 Auto-edit capabilities
- 🔮 Multi-language support
- 🔮 Trend analysis
- 🔮 Mobile app
- 🔮 Social media integration
- 🔮 Brand intelligence

---

## 8. Glossary

- **Hook**: The first 3-5 seconds of a video designed to capture attention
- **CTA**: Call-to-Action, prompting viewers to take a specific action
- **LUFS**: Loudness Units relative to Full Scale, audio loudness measurement
- **BPM**: Beats Per Minute, tempo measurement for music
- **Aspect Ratio**: Width-to-height ratio of video (e.g., 9:16 for vertical)
- **Scene Change**: Transition between different shots or scenes
- **Laplacian Variance**: Mathematical measure of image sharpness
- **Rule of Thirds**: Composition guideline dividing frame into 9 equal parts
- **Spectral Flatness**: Measure of audio noise vs tonal content

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Complete - MVP Requirements Defined
