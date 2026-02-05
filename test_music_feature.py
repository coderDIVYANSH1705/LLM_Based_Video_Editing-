#!/usr/bin/env python3
"""
Test script to verify music recommendation feature
"""

import sys
sys.path.insert(0, 'backend')

from services.audio_analyzer import AudioAnalyzer
from services.llm_service import LLMService

def test_audio_detection(video_path: str):
    """Test if audio is detected as silent/low"""
    print(f"\n{'='*60}")
    print(f"Testing Audio Detection")
    print(f"{'='*60}\n")
    
    analyzer = AudioAnalyzer(video_path)
    metrics = analyzer.analyze()
    
    print(f"Audio Metrics:")
    print(f"  - Has Audio: {metrics.get('has_audio', False)}")
    print(f"  - Average dB: {metrics.get('loudness', {}).get('average_db', 'N/A')}")
    print(f"  - Is Silent/Low: {metrics.get('is_silent_or_low', False)}")
    print(f"  - Too Quiet: {metrics.get('loudness', {}).get('is_too_quiet', False)}")
    
    if metrics.get('is_silent_or_low'):
        print(f"\n✅ Video IS detected as silent/low audio (< -40dB)")
        print(f"   Music recommendation WILL be generated")
    else:
        print(f"\n❌ Video is NOT detected as silent/low audio")
        print(f"   Music recommendation will NOT be generated")
        print(f"\n💡 Tip: The threshold is -40dB. Your video has {metrics.get('loudness', {}).get('average_db', 'N/A')}dB")
    
    return metrics

def test_music_recommendation(video_path: str):
    """Test music recommendation generation"""
    print(f"\n{'='*60}")
    print(f"Testing Music Recommendation")
    print(f"{'='*60}\n")
    
    # Get audio metrics
    audio_analyzer = AudioAnalyzer(video_path)
    audio_metrics = audio_analyzer.analyze()
    
    # Mock video metrics for testing
    video_metrics = {
        'duration': 15.0,
        'scene_changes': 8,
        'brightness': {'is_bright': True, 'is_dark': False}
    }
    
    # Test LLM service
    llm_service = LLMService()
    
    if audio_metrics.get('is_silent_or_low'):
        print("🎵 Generating music recommendation...")
        music_rec = llm_service._generate_music_recommendation(
            video_metrics=video_metrics,
            audio_metrics=audio_metrics,
            platform='instagram'
        )
        
        print(f"\n✅ Music Recommendation Generated:")
        print(f"  - Genre: {music_rec.get('genre')}")
        print(f"  - Mood: {music_rec.get('mood')}")
        print(f"  - BPM: {music_rec.get('bpm_range')}")
        print(f"  - Energy: {music_rec.get('energy_level')}")
        print(f"  - Vocals: {music_rec.get('vocals_preference')}")
        print(f"  - Keywords: {music_rec.get('search_keywords')}")
        print(f"\n  Reasoning: {music_rec.get('reasoning')}")
        
        return music_rec
    else:
        print("❌ Video is not silent/low, skipping music recommendation")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_music_feature.py <video_path>")
        print("\nExample:")
        print("  python test_music_feature.py backend/uploads/test_video.mp4")
        sys.exit(1)
    
    video_path = sys.argv[1]
    
    print(f"\n🎬 Testing Music Feature with: {video_path}")
    
    # Test audio detection
    audio_metrics = test_audio_detection(video_path)
    
    # Test music recommendation if silent
    if audio_metrics.get('is_silent_or_low'):
        music_rec = test_music_recommendation(video_path)
    
    print(f"\n{'='*60}")
    print(f"Test Complete!")
    print(f"{'='*60}\n")
