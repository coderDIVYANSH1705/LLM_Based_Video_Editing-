# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Ollama Model Not Found

**Error:** `Model 'llama3.1:8b' not found`

**Solution:**
```bash
# Check if model is downloaded
ollama list

# If not listed, pull it
ollama pull llama3.1:8b

# Wait for download to complete (4.9GB)
# This can take 15-30 minutes depending on internet speed
```

**Check download progress:**
```bash
# In another terminal while downloading
watch -n 1 ollama list
```

### 2. Ollama Not Running

**Error:** `Connection refused to localhost:11434`

**Solution:**
```bash
# Start Ollama
ollama serve

# Or in background
nohup ollama serve > /dev/null 2>&1 &

# Verify it's running
curl http://localhost:11434/api/tags
```

### 3. FFmpeg Not Installed

**Error:** `ffmpeg: command not found`

**Solution:**
```bash
# macOS
brew install ffmpeg

# Verify installation
ffmpeg -version
```

### 4. Python Virtual Environment Issues

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend

# Create fresh venv
rm -rf venv
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Verify
python -c "import fastapi; print('OK')"
```

### 5. Port Already in Use

**Error:** `Address already in use: 8000`

**Solution:**
```bash
# Find process using port 8000
lsof -ti:8000

# Kill it
kill -9 $(lsof -ti:8000)

# Or use different port
PORT=8001 python main.py
```

### 6. CORS Errors in Frontend

**Error:** `Access-Control-Allow-Origin`

**Solution:**
```bash
# Make sure backend is running on port 8000
# Make sure frontend is running on port 3000

# Check .env.local in frontend
cat frontend/.env.local
# Should be: NEXT_PUBLIC_API_URL=http://localhost:8000

# Restart both services
```

### 7. Video Upload Fails

**Error:** `File must be a video`

**Solution:**
- Ensure file is actually a video (MP4, MOV, AVI)
- Check file size (must be <100MB)
- Try a different video file
- Check backend logs for details

### 8. Whisper Model Download

**First run is slow:** Whisper downloads ~140MB model

**Solution:**
```bash
# Pre-download Whisper model
python -c "import whisper; whisper.load_model('base')"

# This will download once, then cache
```

### 9. Analysis Takes Too Long

**Issue:** Analysis takes >2 minutes

**Solutions:**
```python
# backend/services/content_analyzer.py
# Change line: self.model = whisper.load_model("base")
# To: self.model = whisper.load_model("tiny")  # Faster, less accurate

# backend/services/video_analyzer.py
# Reduce frame sampling
# Change: while frame_count < 30:
# To: while frame_count < 10:
```

### 10. Out of Memory

**Error:** `MemoryError` or system freezes

**Solution:**
```bash
# Close other applications
# Use smaller Whisper model (tiny)
# Process shorter videos first
# Restart Ollama: pkill ollama && ollama serve
```

### 11. Frontend Won't Start

**Error:** `npm ERR!` or `Module not found`

**Solution:**
```bash
cd frontend

# Clean install
rm -rf node_modules package-lock.json
npm install

# If still fails, check Node version
node --version  # Should be 18+

# Update Node if needed (using nvm)
nvm install 18
nvm use 18
```

### 12. TypeScript Errors

**Error:** `Type 'X' is not assignable to type 'Y'`

**Solution:**
```bash
# Ignore for MVP (add to tsconfig.json)
# "strict": false

# Or fix types properly
# Check components/*.tsx files
```

### 13. Tailwind Styles Not Working

**Error:** Styles not applying

**Solution:**
```bash
cd frontend

# Rebuild
npm run build
npm run dev

# Check tailwind.config.js paths
# Should include: './components/**/*.{js,ts,jsx,tsx}'
```

### 14. LLM Returns Invalid JSON

**Error:** `JSONDecodeError`

**Solution:**
```python
# backend/services/llm_service.py
# The code already handles this with try/except
# But you can improve prompts:

# Add to system prompt:
"You MUST respond with valid JSON only. No markdown, no explanations."

# Or use structured output (future enhancement)
```

### 15. Video Analysis Returns Zeros

**Issue:** All metrics are 0 or None

**Solution:**
```bash
# Check if OpenCV can read video
python -c "import cv2; cap = cv2.VideoCapture('test.mp4'); print(cap.isOpened())"

# If False, video format might be unsupported
# Convert video:
ffmpeg -i input.mov -c:v libx264 output.mp4
```

## 🧪 Testing Commands

### Test Backend Health
```bash
curl http://localhost:8000/health
```

### Test Ollama
```bash
curl http://localhost:11434/api/tags
```

### Test Video Analysis
```python
from services.video_analyzer import VideoAnalyzer
analyzer = VideoAnalyzer("test.mp4")
print(analyzer.analyze())
```

### Test Audio Analysis
```python
from services.audio_analyzer import AudioAnalyzer
analyzer = AudioAnalyzer("test.mp4")
print(analyzer.analyze())
```

### Test Whisper
```python
import whisper
model = whisper.load_model("base")
result = model.transcribe("test.mp4")
print(result["text"])
```

### Test LLM
```bash
ollama run llama3.1:8b "Say hello"
```

## 📊 Performance Benchmarks

### Expected Processing Times (M1 MacBook Air)

| Task | Time |
|------|------|
| Video upload | 1-3s |
| Video analysis | 5-10s |
| Audio analysis | 3-5s |
| Whisper transcription | 10-20s |
| LLM analysis | 10-15s |
| **Total** | **30-60s** |

### If Slower:
- Close other apps
- Use smaller models
- Reduce sampling rates
- Check CPU usage: `top`

## 🆘 Still Stuck?

### Check Logs

**Backend:**
```bash
cd backend
python main.py
# Watch console output
```

**Frontend:**
```bash
cd frontend
npm run dev
# Watch console output
# Also check browser console (F12)
```

**Ollama:**
```bash
# Check Ollama logs
tail -f ~/.ollama/logs/server.log
```

### Debug Mode

**Backend:**
```python
# main.py - Add at top
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
```typescript
// Add console.logs in components
console.log('Upload data:', formData)
console.log('API response:', response.data)
```

### Clean Slate

```bash
# Nuclear option - start fresh
cd backend
rm -rf venv uploads
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ../frontend
rm -rf node_modules .next
npm install

# Restart Ollama
pkill ollama
ollama serve
```

## 📞 Get Help

1. Check this guide first
2. Read error messages carefully
3. Google the specific error
4. Check GitHub issues for dependencies
5. Ask in Discord communities:
   - FastAPI Discord
   - Ollama Discord
   - Next.js Discord

## ✅ Verification Checklist

Before asking for help, verify:

- [ ] Ollama is running: `curl http://localhost:11434/api/tags`
- [ ] Model is downloaded: `ollama list`
- [ ] FFmpeg is installed: `ffmpeg -version`
- [ ] Python venv is activated: `which python`
- [ ] Dependencies installed: `pip list | grep fastapi`
- [ ] Backend is running: `curl http://localhost:8000/health`
- [ ] Frontend is running: `curl http://localhost:3000`
- [ ] Ports are correct: 8000 (backend), 3000 (frontend), 11434 (ollama)

---

**Most issues are environment-related. Follow the checklist!** ✨
