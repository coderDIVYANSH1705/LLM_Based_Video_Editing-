# 📂 Project Structure

```
AI-Reel-Optimizer/
│
├── 📄 readme.md                 # Project overview & features
├── 📄 Roadmap.md                # Detailed technical roadmap
├── 📄 QUICKSTART.md             # 5-minute setup guide
├── 📄 SETUP.md                  # Detailed setup instructions
├── 📄 PROJECT_STRUCTURE.md      # This file
├── 🔧 .gitignore                # Git ignore rules
├── 🚀 run.sh                    # Auto-start script
├── 🧪 test_backend.py           # Backend test script
│
├── 🐍 backend/                  # FastAPI Backend
│   ├── main.py                  # Main FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   │
│   └── services/                # Analysis services
│       ├── __init__.py
│       ├── video_analyzer.py    # OpenCV video analysis
│       ├── audio_analyzer.py    # Librosa audio analysis
│       ├── content_analyzer.py  # Whisper transcription
│       └── llm_service.py       # Ollama LLM integration
│
└── ⚛️  frontend/                # Next.js Frontend
    ├── package.json             # Node dependencies
    ├── tsconfig.json            # TypeScript config
    ├── next.config.js           # Next.js config
    ├── tailwind.config.js       # Tailwind CSS config
    ├── postcss.config.js        # PostCSS config
    ├── .env.local               # Frontend environment
    ├── .env.local.example       # Environment template
    │
    ├── app/                     # Next.js 14 App Router
    │   ├── page.tsx             # Main page (home)
    │   ├── layout.tsx           # Root layout
    │   └── globals.css          # Global styles
    │
    └── components/              # React components
        ├── UploadSection.tsx    # Video upload UI
        └── ResultsDashboard.tsx # Results display UI
```

## 🔍 Key Files Explained

### Backend

**`main.py`**
- FastAPI application entry point
- `/api/analyze` endpoint for video analysis
- CORS configuration
- File upload handling

**`services/video_analyzer.py`**
- OpenCV-based video analysis
- Brightness, blur, shake detection
- Scene change detection
- First-frame quality analysis

**`services/audio_analyzer.py`**
- Librosa audio processing
- Loudness (LUFS) analysis
- Silence gap detection
- Background noise estimation

**`services/content_analyzer.py`**
- Whisper speech-to-text
- Transcript generation with timestamps
- Language detection

**`services/llm_service.py`**
- Ollama integration
- Platform-specific prompt engineering
- Structured JSON output generation
- Scoring and suggestions

### Frontend

**`app/page.tsx`**
- Main application page
- State management for upload/results
- Component orchestration

**`components/UploadSection.tsx`**
- Video file upload interface
- Platform selection (Instagram/YouTube/Other)
- Form validation
- API communication

**`components/ResultsDashboard.tsx`**
- Results visualization
- Score cards for video/audio/content
- Top priorities display
- Detailed suggestions breakdown

## 🔄 Data Flow

```
User uploads video
    ↓
Frontend (UploadSection)
    ↓
POST /api/analyze
    ↓
Backend (main.py)
    ↓
┌─────────────────────────────────┐
│  Parallel Analysis Pipeline     │
├─────────────────────────────────┤
│ 1. VideoAnalyzer                │
│    - Extract frames             │
│    - Analyze quality            │
│                                 │
│ 2. AudioAnalyzer                │
│    - Extract audio              │
│    - Analyze loudness/noise     │
│                                 │
│ 3. ContentAnalyzer              │
│    - Transcribe with Whisper    │
│    - Generate timestamps        │
└─────────────────────────────────┘
    ↓
LLMService (Ollama)
    ↓
Platform-specific analysis
    ↓
Structured JSON response
    ↓
Frontend (ResultsDashboard)
    ↓
User sees suggestions
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **OpenCV**: Video frame analysis
- **FFmpeg**: Video/audio extraction
- **Librosa**: Audio signal processing
- **Pydub**: Audio manipulation
- **Whisper**: Speech-to-text (OpenAI)
- **Ollama**: Local LLM inference

### Frontend
- **Next.js 14**: React framework (App Router)
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client
- **Lucide React**: Icon library

## 📊 Analysis Metrics

### Video Metrics
- Duration
- Resolution (width × height)
- FPS (frames per second)
- Average brightness
- Blur score (Laplacian variance)
- Scene changes count
- First-frame quality

### Audio Metrics
- Duration
- Sample rate
- Loudness (dB)
- Silence gaps (timestamps)
- Noise level (spectral flatness)

### Content Metrics
- Full transcript
- Timestamped segments
- Hook strength score (0-10)
- CTA presence (boolean)
- Language detected

## 🎯 Platform-Specific Rules

### Instagram
- Optimal: 15-30s
- Aspect: 9:16 (vertical)
- Hook: First 3s critical
- CTA: Last 5s

### YouTube Shorts
- Optimal: 30-60s
- Aspect: 9:16 (vertical)
- Hook: First 5s
- CTA: Throughout + end

### Other
- Flexible duration
- Flexible aspect ratio
- General best practices

## 🚀 Deployment Considerations

### Local Development
- Ollama runs locally (no API costs)
- Whisper downloads once (~140MB)
- Fast iteration cycle

### Production (Future)
- Replace Ollama with cloud LLM (GPT-4, Gemini)
- Add video storage (S3, Supabase)
- Implement user authentication
- Add rate limiting
- Queue system for processing (Celery + Redis)

## 📈 Scalability Path

1. **MVP** (Current): Local processing
2. **Beta**: Cloud LLM + storage
3. **Production**: Distributed processing
4. **Enterprise**: Multi-tenant, analytics

## 🔐 Security Notes

- Videos are temporarily stored and deleted after analysis
- No user data persistence in MVP
- CORS restricted to localhost
- File size limits enforced
- File type validation

## 🧪 Testing Strategy

1. **Unit Tests**: Individual analyzers
2. **Integration Tests**: Full pipeline
3. **E2E Tests**: Frontend → Backend
4. **Performance Tests**: Processing time benchmarks

## 📝 Environment Variables

### Backend (.env)
```
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.1:8b
OLLAMA_HOST=http://localhost:11434
PORT=8000
UPLOAD_DIR=./uploads
MAX_VIDEO_SIZE_MB=100
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎓 Learning Resources

- FastAPI: https://fastapi.tiangolo.com
- OpenCV: https://opencv.org
- Whisper: https://github.com/openai/whisper
- Ollama: https://ollama.ai
- Next.js: https://nextjs.org

---

**Built for AI for Bharat Hackathon 🇮🇳**
