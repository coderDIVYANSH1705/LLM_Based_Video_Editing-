# ⚡ Quick Start (5 Minutes)

## 1. Install System Dependencies

```bash
# Install FFmpeg (required for video processing)
brew install ffmpeg

# Verify Ollama is installed and LLaMA model is downloaded
ollama list  # Should show llama3.1:8b
```

## 2. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Backend is ready!
```

## 3. Setup Frontend

```bash
cd frontend

# Install Node packages
npm install

# Frontend is ready!
```

## 4. Run the App

### Option A: Manual (Recommended for Development)

**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option B: Auto Start (All at Once)

```bash
./run.sh
```

## 5. Test It!

1. Open browser: `http://localhost:3000`
2. Upload a short video (test with any ≤60s video)
3. Select platform (Instagram/YouTube Shorts)
4. Click "Analyze Video"
5. Wait ~30-60 seconds
6. View AI-powered suggestions!

## 🎯 What to Test

- **Video Quality**: Brightness, blur, shake detection
- **Audio Quality**: Loudness, noise, silence gaps
- **Content Analysis**: Hook strength, CTA detection, pacing
- **Platform Rules**: Instagram vs YouTube Shorts optimization

## 🐛 Common Issues

**"Ollama not responding"**
```bash
# Check if running
curl http://localhost:11434/api/tags

# Restart if needed
pkill ollama
ollama serve
```

**"Module not found" errors**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

**"FFmpeg not found"**
```bash
brew install ffmpeg
```

## 📁 Project Structure

```
backend/
  ├── main.py                    # FastAPI server
  ├── services/
  │   ├── video_analyzer.py      # OpenCV video analysis
  │   ├── audio_analyzer.py      # Librosa audio analysis
  │   ├── content_analyzer.py    # Whisper transcription
  │   └── llm_service.py         # Ollama LLM integration
  └── requirements.txt

frontend/
  ├── app/
  │   └── page.tsx               # Main UI
  ├── components/
  │   ├── UploadSection.tsx      # Upload interface
  │   └── ResultsDashboard.tsx   # Results display
  └── package.json
```

## 🚀 Next Steps

1. ✅ Test with sample videos
2. ✅ Fine-tune LLM prompts in `llm_service.py`
3. ✅ Customize platform rules
4. ✅ Improve UI styling
5. ✅ Add more metrics
6. ✅ Create demo video for hackathon

## 💡 Tips

- First analysis will be slower (Whisper model download)
- Use short videos (15-30s) for faster testing
- Check backend logs for debugging: `http://localhost:8000/docs`
- LLaMA 3.1 8B works great on M1 Air!

---

**Ready to optimize some reels!** 🎬
