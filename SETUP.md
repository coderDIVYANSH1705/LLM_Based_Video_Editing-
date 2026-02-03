# 🚀 AI Reel Optimizer - Setup Guide

## Prerequisites

- Python 3.9+
- Node.js 18+
- FFmpeg installed (`brew install ffmpeg`)
- Ollama installed and running

## Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start Ollama (in separate terminal)
ollama serve

# Pull LLaMA model (if not already done)
ollama pull llama3.1:8b

# Run backend
python main.py
```

Backend will run on `http://localhost:8000`

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.local.example .env.local

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Testing

1. Open `http://localhost:3000`
2. Upload a short video (≤60s)
3. Select platform (Instagram/YouTube Shorts/Other)
4. Click "Analyze Video"
5. Wait 30-60s for analysis
6. View results dashboard

## Troubleshooting

### Ollama not responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
pkill ollama
ollama serve
```

### FFmpeg not found
```bash
brew install ffmpeg
```

### Whisper model download
First run will download Whisper base model (~140MB). This is normal.

### CORS errors
Make sure backend is running on port 8000 and frontend on port 3000.

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI app
│   ├── services/
│   │   ├── video_analyzer.py
│   │   ├── audio_analyzer.py
│   │   ├── content_analyzer.py
│   │   └── llm_service.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── UploadSection.tsx
│   │   └── ResultsDashboard.tsx
│   └── package.json
└── readme.md
```

## Next Steps

1. Test with sample videos
2. Fine-tune LLM prompts
3. Add more platform-specific rules
4. Improve UI/UX
5. Add error handling
6. Create demo video for hackathon
