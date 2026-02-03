# 🎯 Quick Command Reference

## 📋 Essential Commands

### Check Ollama Model Status
```bash
ollama list
```

### Wait for Model Download
The `llama3.1:8b` model is **4.9GB**. Download takes 15-30 minutes.

Check progress:
```bash
# In the terminal where you ran: ollama run llama3.1:8b
# You'll see: pulling 667b0c1932bc: XX% ▕███▏ XXX MB/4.9 GB
```

### Test Ollama (After Download)
```bash
ollama run llama3.1:8b "Hello, how are you?"
```

## 🚀 Start the Application

### Option 1: Automatic (All Services)
```bash
./run.sh
```

### Option 2: Manual (Recommended)

**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python main.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔧 Setup Commands

### First Time Setup - Backend
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### First Time Setup - Frontend
```bash
cd frontend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### Install System Dependencies
```bash
# FFmpeg (required for video processing)
brew install ffmpeg

# Verify
ffmpeg -version
```

## 🧪 Testing Commands

### Test Backend Health
```bash
curl http://localhost:8000/health
```

### Test Backend Root
```bash
curl http://localhost:8000/
```

### Test Ollama
```bash
curl http://localhost:11434/api/tags
```

### Run Backend Tests
```bash
python test_backend.py
```

### Test Individual Services
```bash
cd backend
source venv/bin/activate

# Test imports
python -c "from services.video_analyzer import VideoAnalyzer; print('✅ Video Analyzer OK')"
python -c "from services.audio_analyzer import AudioAnalyzer; print('✅ Audio Analyzer OK')"
python -c "from services.content_analyzer import ContentAnalyzer; print('✅ Content Analyzer OK')"
python -c "from services.llm_service import LLMService; print('✅ LLM Service OK')"
```

## 🐛 Debugging Commands

### Check Running Processes
```bash
# Check if Ollama is running
ps aux | grep ollama

# Check if backend is running
ps aux | grep python

# Check if frontend is running
ps aux | grep node
```

### Check Port Usage
```bash
# Check port 8000 (backend)
lsof -i :8000

# Check port 3000 (frontend)
lsof -i :3000

# Check port 11434 (ollama)
lsof -i :11434
```

### Kill Processes
```bash
# Kill process on port 8000
kill -9 $(lsof -ti:8000)

# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Kill all Ollama processes
pkill ollama

# Kill all Python processes
pkill python

# Kill all Node processes
pkill node
```

### View Logs
```bash
# Backend logs (if running in background)
tail -f backend/logs/app.log

# Ollama logs
tail -f ~/.ollama/logs/server.log

# Frontend logs (check terminal output)
```

## 🔄 Restart Commands

### Restart Everything
```bash
# Kill all services
pkill ollama && pkill python && pkill node

# Wait a moment
sleep 2

# Start Ollama
ollama serve &

# Start Backend
cd backend && source venv/bin/activate && python main.py &

# Start Frontend
cd frontend && npm run dev
```

### Restart Just Backend
```bash
# Kill backend
pkill python

# Restart
cd backend
source venv/bin/activate
python main.py
```

### Restart Just Frontend
```bash
# Kill frontend
pkill node

# Restart
cd frontend
npm run dev
```

## 📦 Dependency Management

### Update Backend Dependencies
```bash
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
```

### Update Frontend Dependencies
```bash
cd frontend
npm update
```

### Add New Backend Package
```bash
cd backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt
```

### Add New Frontend Package
```bash
cd frontend
npm install package-name
```

## 🧹 Cleanup Commands

### Clean Backend
```bash
cd backend

# Remove virtual environment
rm -rf venv

# Remove uploaded files
rm -rf uploads

# Remove Python cache
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
```

### Clean Frontend
```bash
cd frontend

# Remove node modules
rm -rf node_modules

# Remove build files
rm -rf .next

# Remove lock file
rm -rf package-lock.json
```

### Full Clean (Nuclear Option)
```bash
# Clean everything
rm -rf backend/venv backend/uploads backend/__pycache__
rm -rf frontend/node_modules frontend/.next
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# Reinstall
cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ../frontend && npm install
```

## 🔍 Inspection Commands

### Check Python Version
```bash
python3 --version
```

### Check Node Version
```bash
node --version
npm --version
```

### Check Installed Packages
```bash
# Backend
cd backend
source venv/bin/activate
pip list

# Frontend
cd frontend
npm list --depth=0
```

### Check File Sizes
```bash
# Check video file size
ls -lh path/to/video.mp4

# Check upload directory
du -sh backend/uploads
```

### Check System Resources
```bash
# CPU and memory usage
top

# Disk space
df -h

# Memory usage
free -h  # Linux
vm_stat  # macOS
```

## 📊 Performance Commands

### Benchmark Video Processing
```bash
time python -c "
from services.video_analyzer import VideoAnalyzer
analyzer = VideoAnalyzer('test.mp4')
print(analyzer.analyze())
"
```

### Benchmark Audio Processing
```bash
time python -c "
from services.audio_analyzer import AudioAnalyzer
analyzer = AudioAnalyzer('test.mp4')
print(analyzer.analyze())
"
```

### Benchmark LLM Response
```bash
time ollama run llama3.1:8b "Analyze this video hook: 'Wait for it...'"
```

## 🎯 Development Workflow

### Daily Workflow
```bash
# 1. Start services
ollama serve &
cd backend && source venv/bin/activate && python main.py &
cd frontend && npm run dev

# 2. Make changes to code

# 3. Test changes
python test_backend.py
curl http://localhost:8000/health

# 4. Commit changes
git add .
git commit -m "Your message"
git push
```

### Before Demo
```bash
# 1. Test everything
python test_backend.py

# 2. Test with sample video
# Upload through UI

# 3. Check logs for errors
# Review terminal outputs

# 4. Restart services fresh
pkill ollama && pkill python && pkill node
./run.sh
```

## 🚀 Deployment Commands (Future)

### Build Frontend for Production
```bash
cd frontend
npm run build
npm start
```

### Run Backend in Production
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📝 Git Commands

### Initial Commit
```bash
git add .
git commit -m "Initial commit: AI Reel Optimizer MVP"
git push origin main
```

### Save Progress
```bash
git add .
git commit -m "Add feature: [description]"
git push
```

### Create Branch
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

## 🎓 Learning Commands

### Explore FastAPI Docs
```bash
# Start backend, then visit:
open http://localhost:8000/docs
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Root endpoint
curl http://localhost:8000/

# Test upload (with video file)
curl -X POST http://localhost:8000/api/analyze \
  -F "video=@test.mp4" \
  -F "platform=instagram"
```

## 💡 Pro Tips

### Run in Background
```bash
# Backend
cd backend && source venv/bin/activate && nohup python main.py > backend.log 2>&1 &

# Frontend
cd frontend && nohup npm run dev > frontend.log 2>&1 &
```

### Watch Logs in Real-Time
```bash
# Backend
tail -f backend.log

# Frontend
tail -f frontend.log
```

### Quick Status Check
```bash
# One-liner to check all services
curl -s http://localhost:8000/health && curl -s http://localhost:3000 > /dev/null && curl -s http://localhost:11434/api/tags > /dev/null && echo "✅ All services running" || echo "❌ Some services down"
```

---

**Bookmark this file for quick reference!** 📌
