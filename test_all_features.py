#!/usr/bin/env python3
"""
Test script to verify all features are generated
"""

import sys
import json
sys.path.insert(0, 'backend')

from services.llm_service import LLMService

def test_all_features():
    """Test if all features are generated"""
    print(f"\n{'='*60}")
    print(f"Testing All Features")
    print(f"{'='*60}\n")
    
    # Mock metrics
    video_metrics = {
        'duration': 15.0,
        'scene_changes': 8,
        'brightness': {'is_bright': True, 'is_dark': False},
        'resolution': {'width': 1080, 'height': 1920}
    }
    
    audio_metrics = {
        'has_audio': True,
        'is_silent_or_low': False,
        'loudness': {'average_db': -20}
    }
    
    transcript = {
        'text': 'This is a test video about amazing content.'
    }
    
    platform = 'instagram'
    
    # Test LLM service
    print("🧪 Testing LLMService.generate_suggestions()...\n")
    llm_service = LLMService()
    
    try:
        response = llm_service.generate_suggestions(
            video_metrics=video_metrics,
            audio_metrics=audio_metrics,
            transcript=transcript,
            platform=platform
        )
        
        print(f"\n{'='*60}")
        print(f"✅ Response Generated Successfully!")
        print(f"{'='*60}\n")
        
        # Check for required fields
        print("📋 Checking Response Fields:\n")
        
        fields_to_check = [
            ('music_recommendation', '🎵'),
            ('hashtag_suggestions', '#️⃣'),
            ('title_suggestions', '📝'),
            ('overall_score', '⭐'),
            ('video', '🎥'),
            ('audio', '🔊'),
            ('content', '📄')
        ]
        
        all_present = True
        for field, emoji in fields_to_check:
            if field in response:
                print(f"  {emoji} {field}: ✅ PRESENT")
                if field == 'music_recommendation':
                    print(f"      Genre: {response[field].get('genre')}")
                    print(f"      Mood: {response[field].get('mood')}")
                    print(f"      BPM: {response[field].get('bpm_range')}")
                elif field == 'hashtag_suggestions':
                    print(f"      Count: {len(response[field])}")
                    print(f"      Tags: {', '.join(response[field][:3])}...")
                elif field == 'title_suggestions':
                    print(f"      Count: {len(response[field])}")
                    print(f"      First: {response[field][0]}")
            else:
                print(f"  {emoji} {field}: ❌ MISSING")
                all_present = False
        
        print(f"\n{'='*60}")
        if all_present:
            print("✅ ALL FEATURES WORKING!")
        else:
            print("⚠️  SOME FEATURES MISSING")
        print(f"{'='*60}\n")
        
        # Print full response as JSON
        print("📄 Full Response (JSON):\n")
        print(json.dumps(response, indent=2, default=str))
        
        return response
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print(f"\n🎬 Testing All Features Generation")
    print(f"   This will test music, hashtags, and titles\n")
    
    response = test_all_features()
    
    if response:
        print(f"\n✅ Test Complete - All features should be working!")
        print(f"\n💡 Next Steps:")
        print(f"   1. Restart backend: cd backend && python3 main.py")
        print(f"   2. Refresh frontend (Ctrl+Shift+R)")
        print(f"   3. Upload a video and check browser console")
    else:
        print(f"\n❌ Test Failed - Check errors above")
