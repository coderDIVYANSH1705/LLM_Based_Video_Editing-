# 🚀 Quick Start Guide

## Get All Features Working in 3 Steps

### Step 1: Start Ollama
```bash
ollama serve
```

Keep this terminal open!

### Step 2: Start Backend
```bash
cd backend
python3 main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Keep this terminal open!

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
```

## Test It!

1. Open http://localhost:3000
2. Upload any video
3. Select platform (Instagram, YouTube Shorts, or Other)
4. Click "Analyze Video"
5. Wait ~15 seconds

## What You'll See

### 1. Overall Score
Big score out of 10 with color coding

### 2. Top 3 Priorities
Most important improvements

### 3. Music Recommendation 🎵
- Genre, mood, BPM
- Energy level
- Search keywords (click to find music)
- Best for: [Platform]

### 4. Hashtag Suggestions #️⃣
- 5 relevant hashtags
- Click to copy individual
- "Copy All" button

### 5. Title Suggestions 📝
- 3 different title options
- Copy button for each
- Optimized for platform

### 6. Thumbnail Suggestions 🖼️
- 5 best frames from video
- Quality scores
- Download buttons

### 7. Detailed Analysis
- Video quality score
- Audio quality score
- Content score

## Troubleshooting

### "Connection refused" error?
- Make sure Ollama is running: `ollama serve`
- Make sure backend is running: `python3 main.py`

### "Model not found" error?
```bash
ollama pull llama3.1:8b
```

### Features not showing?
1. Check backend terminal for errors
2. Look for these emojis:
   - 🎵 Music recommendation
   - 📝 Hashtag and title suggestions
   - 🖼️ Thumbnail suggestions
3. If missing, restart backend

### Still not working?
1. Clear browser cache (Ctrl+Shift+R)
2. Check browser console (F12) for errors
3. Verify API response in Network tab

## Tips

- **Upload short videos** (15-60 seconds) for faster analysis
- **Try different platforms** to see different recommendations
- **Click hashtags** to copy them individually
- **Click search keywords** to find royalty-free music on YouTube
- **Download thumbnails** to use in your posts

## That's It!

You're ready to optimize your videos with AI! 🎉

---

**Need help?** Check `COMPLETE_FEATURES_SUMMARY.md` for detailed documentation.
