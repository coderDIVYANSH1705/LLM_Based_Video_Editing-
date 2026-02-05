# 🎵 Background Music Recommendation Feature

## Overview
The AI-powered background music recommendation feature automatically detects videos with no audio or very low audio levels (below -40dB) and suggests appropriate background music to enhance engagement and viewer retention.

## How It Works

### 1. Audio Detection
The system analyzes the video's audio track using `librosa` and `pydub`:
- Measures average loudness in decibels (dB)
- Detects silence gaps and audio quality
- Flags videos with audio below -40dB threshold

### 2. AI Music Recommendation
When silent/low-audio is detected, the LLM analyzes:
- **Video pacing**: Scene change frequency
- **Visual brightness**: Bright vs dark content
- **Platform context**: Instagram, YouTube Shorts, etc.
- **Duration**: Video length considerations

### 3. Recommendation Output
The AI provides:
- **Genre**: Music style (e.g., "Upbeat Pop", "Lo-fi Chill")
- **Mood**: Emotional tone (e.g., "Energetic", "Relaxed")
- **BPM Range**: Beats per minute (e.g., "120-140 BPM")
- **Vocals Preference**: Instrumental only, vocals OK, or avoid vocals
- **Energy Level**: High, Medium, or Low
- **Reasoning**: Why this music matches your video
- **Search Keywords**: Quick links to find royalty-free music

## Features

### Smart Detection
```python
# Automatically detects silent/low-audio videos
is_silent_or_low = audio_metrics.get('is_silent_or_low', False)
```

### Platform-Specific Recommendations
- Instagram: Trending, upbeat music
- YouTube Shorts: Viral, energetic tracks
- Other platforms: Flexible recommendations

### Interactive Search
- Click any keyword to search YouTube for royalty-free music
- Pre-configured search terms optimized for finding no-copyright tracks

## Technical Implementation

### Backend Components

#### 1. Audio Analyzer (`backend/services/audio_analyzer.py`)
```python
def _is_silent_or_low_audio(self, loudness_data: dict) -> bool:
    """Check if video has no audio or very low audio levels (below -40dB)"""
    avg_db = loudness_data.get('average_db', -100)
    return avg_db < -40
```

#### 2. LLM Service (`backend/services/llm_service.py`)
```python
def _generate_music_recommendation(
    self,
    video_metrics: Dict[str, Any],
    audio_metrics: Dict[str, Any],
    platform: str
) -> Dict[str, Any]:
    """Generate music recommendations for silent/low-audio videos"""
    # Analyzes video characteristics
    # Generates AI-powered music suggestions
    # Returns structured recommendation
```

### Frontend Components

#### Music Recommendation Card (`frontend/components/MusicRecommendationCard.tsx`)
- Beautiful gradient design with glow effects
- Grid layout for music characteristics
- Interactive search buttons
- Energy level indicators with animations
- Reasoning explanation

#### Dashboard Integration (`frontend/components/ResultsDashboard.tsx`)
- Conditionally renders when `music_recommendation` exists
- Positioned between priorities and thumbnails
- Seamless integration with existing UI

## API Response Format

```json
{
  "music_recommendation": {
    "genre": "Upbeat Pop",
    "mood": "Energetic",
    "bpm_range": "120-140 BPM",
    "vocals_preference": "Instrumental only",
    "energy_level": "High",
    "reasoning": "Based on your video's fast pacing and Instagram trends, this music style would complement your content well.",
    "search_keywords": [
      "royalty free upbeat pop",
      "no copyright energetic music",
      "instagram background music"
    ]
  }
}
```

## Usage Example

### 1. Upload a Silent Video
```bash
# Video with no audio or very quiet audio
curl -X POST http://localhost:8000/api/analyze \
  -F "video=@silent_video.mp4" \
  -F "platform=instagram"
```

### 2. Receive Music Recommendation
The response will include a `music_recommendation` object with all details.

### 3. Find Music
Click any search keyword in the UI to find royalty-free music on YouTube.

## Music Selection Guidelines

### Fast-Paced Videos (>0.5 scene changes/sec)
- **Genre**: Upbeat Pop, Electronic, Hip-Hop
- **BPM**: 120-140
- **Energy**: High
- **Best for**: Action, sports, fast cuts

### Medium-Paced Videos (0.2-0.5 scene changes/sec)
- **Genre**: Indie, Acoustic, Soft Rock
- **BPM**: 90-120
- **Energy**: Medium
- **Best for**: Vlogs, tutorials, lifestyle

### Slow-Paced Videos (<0.2 scene changes/sec)
- **Genre**: Lo-fi, Ambient, Chill
- **BPM**: 60-90
- **Energy**: Low
- **Best for**: Meditation, nature, ASMR

### Bright Videos
- Pair with upbeat, major-key music
- Positive, energetic vibes

### Dark Videos
- Pair with dramatic, moody music
- Minor keys, atmospheric sounds

## Platform Considerations

### Instagram Reels
- Trending music increases discoverability
- Upbeat, catchy hooks (first 3 seconds)
- 15-30 second optimal length

### YouTube Shorts
- Viral music trends
- Energetic throughout
- 30-60 second optimal length

## Finding Royalty-Free Music

### Recommended Sources
1. **YouTube Audio Library**: Free, no attribution required
2. **Epidemic Sound**: Subscription-based, high quality
3. **Artlist**: Subscription-based, unlimited downloads
4. **Free Music Archive**: Free, various licenses
5. **Incompetech**: Free with attribution

### Search Tips
- Always include "royalty free" or "no copyright"
- Specify platform (e.g., "instagram music")
- Include genre and mood keywords
- Check license requirements before use

## Fallback Behavior

If the LLM fails to generate a recommendation, the system provides a sensible fallback:
- Fast videos → Upbeat Pop (120-140 BPM)
- Slow videos → Lo-fi Chill (70-90 BPM)
- Generic search keywords included

## Future Enhancements

### Planned Features
- [ ] Direct integration with music libraries
- [ ] Audio preview before download
- [ ] BPM matching with video pacing
- [ ] Mood-based color grading suggestions
- [ ] Trending music recommendations
- [ ] Custom music upload and analysis

### Advanced AI Features
- [ ] Analyze video emotions for music matching
- [ ] Detect video category (fitness, cooking, etc.)
- [ ] Multi-language music recommendations
- [ ] Beat-synced editing suggestions

## Troubleshooting

### Music Recommendation Not Showing
1. Check if video has audio: `audio_metrics.is_silent_or_low`
2. Verify Ollama is running: `ollama serve`
3. Check backend logs for LLM errors

### Inaccurate Recommendations
1. Video analysis may need tuning
2. Adjust -40dB threshold in `audio_analyzer.py`
3. Improve LLM prompt in `llm_service.py`

### Search Not Working
1. Check browser popup blocker
2. Verify search keywords are URL-encoded
3. Try manual YouTube search

## Performance

- **Audio Analysis**: ~1-2 seconds
- **LLM Generation**: ~3-5 seconds
- **Total Overhead**: ~5-7 seconds (only for silent videos)
- **No Impact**: Videos with normal audio skip this feature

## Dependencies

```txt
# Backend
librosa>=0.10.0
pydub>=0.25.1
ollama>=0.1.0

# Frontend
lucide-react (icons)
tailwindcss (styling)
```

## Code Quality

- ✅ Type hints throughout
- ✅ Error handling with fallbacks
- ✅ Logging for debugging
- ✅ Responsive UI design
- ✅ Accessibility compliant

## License

This feature is part of the AI Reel Optimizer project and follows the same license.

---

**Built with ❤️ for content creators who want to maximize engagement**
