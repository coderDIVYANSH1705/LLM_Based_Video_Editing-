# Troubleshooting Music Recommendations

## Why Am I Not Seeing Music Recommendations?

The music recommendation feature only appears when your video has **no audio or very low audio** (below -40dB). Here's how to troubleshoot:

## Step 1: Check Your Video's Audio Level

### Quick Test
Run this command to check if your video qualifies:

```bash
python test_music_feature.py backend/uploads/your_video.mp4
```

This will show:
- Audio level in dB
- Whether it's detected as silent/low
- If music recommendation will be generated

### Understanding the Threshold

- **Below -40dB**: Music recommendation WILL appear ✅
- **Above -40dB**: Music recommendation will NOT appear ❌

Most videos with normal audio are between -20dB to -10dB, so they won't trigger the feature.

## Step 2: Test with a Silent Video

### Option A: Create a Silent Test Video
Use FFmpeg to create a silent video:

```bash
# Create a 10-second silent video from an existing video
ffmpeg -i your_video.mp4 -an -t 10 silent_test.mp4
```

### Option B: Use a Video with Very Quiet Audio
- Screen recordings without microphone
- Videos with background noise only
- Videos where audio was accidentally muted

## Step 3: Verify Backend is Running

Make sure your backend server is running with the latest code:

```bash
cd backend
python main.py
```

Look for this log when analyzing a silent video:
```
🎵 Video has no/low audio, generating music recommendation...
```

## Step 4: Check Browser Console

Open browser DevTools (F12) and check:

1. **Network Tab**: Look at the `/api/analyze` response
2. **Check if `music_recommendation` field exists** in the JSON response
3. **Console Tab**: Look for any React errors

### Expected API Response (Silent Video)
```json
{
  "overall_score": 7.5,
  "music_recommendation": {
    "genre": "Upbeat Pop",
    "mood": "Energetic",
    "bpm_range": "120-140 BPM",
    "vocals_preference": "Instrumental only",
    "energy_level": "High",
    "reasoning": "...",
    "search_keywords": ["..."]
  }
}
```

### Expected API Response (Normal Audio)
```json
{
  "overall_score": 7.5,
  // No music_recommendation field
}
```

## Step 5: Force Music Recommendation (For Testing)

If you want to test the UI without a silent video, temporarily modify the backend:

**File:** `backend/services/llm_service.py`

Change line ~35 from:
```python
if audio_metrics.get('is_silent_or_low', False):
```

To:
```python
if True:  # TESTING ONLY - Always generate music recommendation
```

**Remember to change it back after testing!**

## Step 6: Clear Browser Cache

Sometimes the frontend caches old responses:

1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache completely
3. Restart the frontend dev server

## Step 7: Verify Frontend Integration

Check that the component is imported:

**File:** `frontend/components/ResultsDashboard.tsx`

Should have:
```typescript
import MusicRecommendationCard from './MusicRecommendationCard'

// And in the render:
{results.music_recommendation && (
  <MusicRecommendationCard recommendation={results.music_recommendation} />
)}
```

## Common Issues

### Issue 1: "My video has no audio but still no recommendation"

**Solution**: Check the actual dB level. Some "silent" videos have very quiet noise that's above -40dB.

Run the test script to see the exact dB level:
```bash
python test_music_feature.py your_video.mp4
```

### Issue 2: "Backend logs show music generation but frontend doesn't display it"

**Solution**: 
1. Check browser console for errors
2. Verify the API response includes `music_recommendation`
3. Hard refresh the browser
4. Restart the frontend dev server

### Issue 3: "Ollama error when generating music"

**Solution**:
1. Make sure Ollama is running: `ollama serve`
2. Check if model is downloaded: `ollama list`
3. Test Ollama: `ollama run llama3.1:8b "Hello"`

### Issue 4: "Component not found error"

**Solution**:
1. Verify `MusicRecommendationCard.tsx` exists in `frontend/components/`
2. Restart the frontend dev server
3. Check for TypeScript errors: `npm run build`

## Manual Testing Checklist

- [ ] Backend server is running
- [ ] Frontend dev server is running
- [ ] Ollama is running (`ollama serve`)
- [ ] Video has audio below -40dB (use test script)
- [ ] Browser cache cleared
- [ ] No console errors
- [ ] API response includes `music_recommendation` field

## Debug Mode

Add console logging to see what's happening:

**File:** `frontend/components/ResultsDashboard.tsx`

Add at the top of the component:
```typescript
console.log('Results:', results)
console.log('Has music_recommendation:', !!results.music_recommendation)
```

This will show you exactly what data the component is receiving.

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Check the exact audio level**: Run `python test_music_feature.py your_video.mp4`
2. **Try the force mode**: Temporarily set `if True:` in llm_service.py
3. **Check backend logs**: Look for the 🎵 emoji in the terminal
4. **Verify API response**: Use browser DevTools Network tab

## Quick Fix: Lower the Threshold

If you want music recommendations to appear more often, you can lower the threshold:

**File:** `backend/services/audio_analyzer.py`

Change line ~89 from:
```python
return avg_db < -40
```

To:
```python
return avg_db < -30  # More sensitive threshold
```

This will trigger music recommendations for quieter videos (but not completely silent ones).

---

**Need more help?** Check the backend terminal logs when uploading a video - they show exactly what's happening at each step.
