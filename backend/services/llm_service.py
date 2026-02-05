import os
import json
import ollama
from typing import Dict, Any

class LLMService:
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "ollama")
        self.model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
        
    def generate_suggestions(
        self,
        video_metrics: Dict[str, Any],
        audio_metrics: Dict[str, Any],
        transcript: Dict[str, Any],
        platform: str
    ) -> Dict[str, Any]:
        """Generate optimization suggestions using LLM"""
        
        # Build context prompt
        prompt = self._build_prompt(video_metrics, audio_metrics, transcript, platform)
        
        # Get LLM response
        if self.provider == "ollama":
            response = self._call_ollama(prompt)
        else:
            response = {"error": "Unsupported LLM provider"}
        
        # Always generate music recommendation for all videos
        print("🎵 Generating background music recommendation...")
        try:
            music_rec = self._generate_music_recommendation(
                video_metrics, audio_metrics, platform
            )
            response['music_recommendation'] = music_rec
            print(f"✅ Music recommendation added to response")
        except Exception as e:
            print(f"❌ Music recommendation failed: {str(e)}")
            # Add fallback music recommendation
            response['music_recommendation'] = {
                "genre": "Lo-fi Instrumental",
                "mood": "Calm, Professional",
                "bpm_range": "~95 BPM",
                "vocals_preference": "Instrumental only",
                "energy_level": "Medium",
                "reasoning": "Fallback recommendation for your video content.",
                "search_keywords": ["royalty free music", "no copyright", platform.replace('_', ' ')],
                "best_for": platform.replace('_', ' ').title()
            }
        
        # Generate hashtag and title suggestions
        print("📝 Generating hashtag and title suggestions...")
        try:
            content_suggestions = self._generate_content_suggestions(
                video_metrics, audio_metrics, transcript, platform
            )
            response['hashtag_suggestions'] = content_suggestions['hashtags']
            response['title_suggestions'] = content_suggestions['titles']
            print(f"✅ Hashtags and titles added to response")
        except Exception as e:
            print(f"❌ Content suggestions failed: {str(e)}")
            # Add fallback suggestions
            response['hashtag_suggestions'] = [
                f"#{platform.replace('_', '')}",
                "#viral",
                "#trending",
                "#fyp",
                "#contentcreator"
            ]
            response['title_suggestions'] = [
                f"Amazing {platform.replace('_', ' ').title()} Content",
                "You Have to See This!",
                "Check Out This Video"
            ]
        
        print(f"📦 Final response keys: {list(response.keys())}")
        return response
    
    def _build_prompt(
        self,
        video_metrics: Dict[str, Any],
        audio_metrics: Dict[str, Any],
        transcript: Dict[str, Any],
        platform: str
    ) -> str:
        """Build analysis prompt for LLM"""
        
        platform_rules = {
            "instagram": {
                "optimal_duration": "15-30s",
                "aspect_ratio": "9:16 (vertical)",
                "hook_time": "First 3 seconds critical",
                "cta_placement": "Last 5 seconds"
            },
            "youtube_shorts": {
                "optimal_duration": "30-60s",
                "aspect_ratio": "9:16 (vertical)",
                "hook_time": "First 5 seconds",
                "cta_placement": "Throughout + end"
            },
            "other": {
                "optimal_duration": "15-60s",
                "aspect_ratio": "Flexible",
                "hook_time": "First 3-5 seconds",
                "cta_placement": "End"
            }
        }
        
        rules = platform_rules.get(platform, platform_rules["other"])
        
        prompt = f"""You are an expert video optimization AI for {platform.replace('_', ' ').title()}.

Analyze this video and provide actionable suggestions in JSON format.

VIDEO METRICS:
- Duration: {video_metrics.get('duration', 0):.1f}s
- Resolution: {video_metrics.get('resolution', {})}
- Brightness: {video_metrics.get('brightness', {})}
- Blur Score: {video_metrics.get('blur_score', 0):.1f}
- Scene Changes: {video_metrics.get('scene_changes', 0)}
- First Frame Quality: {video_metrics.get('first_frame_quality', {})}

AUDIO METRICS:
- Loudness: {audio_metrics.get('loudness', {})}
- Silence Gaps: {len(audio_metrics.get('silence_gaps', []))} detected
- Noise Level: {audio_metrics.get('noise_level', {})}

TRANSCRIPT:
{transcript.get('text', 'No speech detected')}

PLATFORM RULES ({platform}):
- Optimal Duration: {rules['optimal_duration']}
- Aspect Ratio: {rules['aspect_ratio']}
- Hook Time: {rules['hook_time']}
- CTA Placement: {rules['cta_placement']}

Provide response in this EXACT JSON format:
{{
  "platform": "{platform}",
  "overall_score": <0-10>,
  "video": {{
    "score": <0-10>,
    "issues": ["issue1", "issue2"],
    "suggestions": ["suggestion1", "suggestion2"]
  }},
  "audio": {{
    "score": <0-10>,
    "issues": ["issue1"],
    "suggestions": ["suggestion1"]
  }},
  "content": {{
    "score": <0-10>,
    "hook_score": <0-10>,
    "has_cta": <true/false>,
    "issues": ["issue1"],
    "suggestions": ["suggestion1"]
  }},
  "top_3_priorities": ["priority1", "priority2", "priority3"]
}}

Be specific, actionable, and reference timestamps when relevant."""

        return prompt
    
    def _call_ollama(self, prompt: str) -> Dict[str, Any]:
        """Call Ollama API"""
        try:
            print(f"🤖 Calling Ollama with model: {self.model}")
            
            response = ollama.chat(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a video optimization expert. Always respond with valid JSON only. No markdown, no explanations, just pure JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            # Parse JSON response
            content = response['message']['content']
            print(f"📝 Raw LLM response: {content[:200]}...")
            
            # Extract JSON from markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            # Parse JSON
            result = json.loads(content)
            print(f"✅ Successfully parsed JSON response")
            
            # Validate required fields
            if not all(key in result for key in ['platform', 'overall_score', 'video', 'audio', 'content']):
                raise ValueError("Missing required fields in LLM response")
            
            return result
        
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {str(e)}")
            print(f"📄 Content that failed to parse: {content}")
            return self._get_fallback_response("JSON parsing failed")
        
        except Exception as e:
            print(f"❌ LLM call failed: {str(e)}")
            return self._get_fallback_response(str(e))
    
    def _get_fallback_response(self, error_msg: str) -> Dict[str, Any]:
        """Return a properly structured fallback response when LLM fails"""
        return {
            "platform": "unknown",
            "overall_score": 5.0,
            "video": {
                "score": 5.0,
                "issues": ["Unable to analyze video quality - LLM error"],
                "suggestions": ["Please try again or check backend logs"]
            },
            "audio": {
                "score": 5.0,
                "issues": ["Unable to analyze audio quality - LLM error"],
                "suggestions": ["Please try again or check backend logs"]
            },
            "content": {
                "score": 5.0,
                "hook_score": 5.0,
                "has_cta": False,
                "issues": ["Unable to analyze content - LLM error"],
                "suggestions": ["Please try again or check backend logs"]
            },
            "top_3_priorities": [
                f"LLM Error: {error_msg}",
                "Check if Ollama is running: ollama serve",
                "Check if model is downloaded: ollama list"
            ]
        }
    
    def _generate_music_recommendation(
        self,
        video_metrics: Dict[str, Any],
        audio_metrics: Dict[str, Any],
        platform: str
    ) -> Dict[str, Any]:
        """Generate music recommendations for all videos"""
        
        # Analyze video characteristics
        scene_changes = video_metrics.get('scene_changes', 0)
        duration = video_metrics.get('duration', 0)
        brightness = video_metrics.get('brightness', {})
        
        # Determine pacing
        if duration > 0:
            pacing = scene_changes / duration
        else:
            pacing = 0
        
        # Check if video has audio
        has_audio = audio_metrics.get('has_audio', True)
        is_silent_or_low = audio_metrics.get('is_silent_or_low', False)
        avg_db = audio_metrics.get('loudness', {}).get('average_db', -20)
        
        # Build music recommendation prompt
        prompt = f"""You are a music expert for {platform.replace('_', ' ').title()} content.

Recommend background music that would complement this video.

VIDEO ANALYSIS:
- Duration: {duration:.1f}s
- Scene Changes: {scene_changes}
- Pacing: {"Fast" if pacing > 0.5 else "Medium" if pacing > 0.2 else "Slow"}
- Brightness: {"Bright" if brightness.get('is_bright') else "Dark" if brightness.get('is_dark') else "Normal"}
- Platform: {platform}
- Has Audio: {"No" if is_silent_or_low else "Yes"}
- Audio Level: {avg_db:.1f}dB

Provide music recommendation in this EXACT JSON format:
{{
  "genre": "<genre name>",
  "mood": "<mood/vibe>",
  "bpm_range": "<BPM range>",
  "vocals_preference": "<Instrumental only/Vocals OK/Avoid vocals>",
  "energy_level": "<High/Medium/Low>",
  "reasoning": "<why this music matches the video>",
  "search_keywords": ["keyword1", "keyword2", "keyword3"],
  "best_for": "<platform name>"
}}

Consider:
- Fast-paced videos need energetic music (120-140 BPM)
- Slow-paced videos need ambient/chill music (60-95 BPM)
- Bright videos pair well with upbeat genres
- Dark videos pair well with dramatic/moody music
- {platform} trends and popular music styles
- If video has audio, suggest complementary background music
- If video has no audio, suggest primary background music

Respond with ONLY the JSON, no markdown, no explanations."""

        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a music recommendation expert. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            content = response['message']['content']
            
            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            music_rec = json.loads(content)
            
            # Validate required fields
            required_fields = ['genre', 'mood', 'bpm_range', 'vocals_preference', 'energy_level', 'reasoning', 'search_keywords']
            if not all(field in music_rec for field in required_fields):
                raise ValueError("Missing required fields in music recommendation")
            
            # Add best_for if not present
            if 'best_for' not in music_rec:
                music_rec['best_for'] = platform.replace('_', ' ').title()
            
            print(f"✅ Music recommendation: {music_rec['genre']} - {music_rec['mood']}")
            return music_rec
        
        except Exception as e:
            print(f"⚠️  Music recommendation generation failed: {str(e)}")
            # Return fallback recommendation based on video characteristics
            if pacing > 0.5:
                # Fast-paced video
                return {
                    "genre": "Upbeat Pop",
                    "mood": "Energetic, Dynamic",
                    "bpm_range": "120-140 BPM",
                    "vocals_preference": "Instrumental only",
                    "energy_level": "High",
                    "reasoning": f"Based on your video's fast pacing ({scene_changes} scene changes in {duration:.1f}s) and {platform} trends, energetic music would keep viewers engaged.",
                    "search_keywords": ["royalty free upbeat music", "no copyright energetic", f"{platform.replace('_', ' ')} music"],
                    "best_for": platform.replace('_', ' ').title()
                }
            elif pacing > 0.2:
                # Medium-paced video
                return {
                    "genre": "Indie Pop",
                    "mood": "Uplifting, Positive",
                    "bpm_range": "100-120 BPM",
                    "vocals_preference": "Instrumental only",
                    "energy_level": "Medium",
                    "reasoning": f"Your video has a moderate pace that pairs well with uplifting indie music, perfect for {platform} content.",
                    "search_keywords": ["royalty free indie music", "no copyright positive", f"{platform.replace('_', ' ')} background music"],
                    "best_for": platform.replace('_', ' ').title()
                }
            else:
                # Slow-paced video
                return {
                    "genre": "Lo-fi Instrumental",
                    "mood": "Calm, Professional",
                    "bpm_range": "~95 BPM",
                    "vocals_preference": "Instrumental only",
                    "energy_level": "Low",
                    "reasoning": f"Your video's calm pacing creates a professional atmosphere that complements lo-fi instrumental music, ideal for {platform}.",
                    "search_keywords": ["royalty free lofi", "no copyright chill music", f"{platform.replace('_', ' ')} lofi"],
                    "best_for": platform.replace('_', ' ').title()
                }


    def _generate_content_suggestions(
        self,
        video_metrics: Dict[str, Any],
        audio_metrics: Dict[str, Any],
        transcript: Dict[str, Any],
        platform: str
    ) -> Dict[str, Any]:
        """Generate hashtag and title suggestions"""
        
        # Analyze video characteristics
        scene_changes = video_metrics.get('scene_changes', 0)
        duration = video_metrics.get('duration', 0)
        brightness = video_metrics.get('brightness', {})
        transcript_text = transcript.get('text', 'No speech detected')
        
        # Determine pacing
        if duration > 0:
            pacing = scene_changes / duration
        else:
            pacing = 0
        
        # Build content suggestion prompt
        prompt = f"""You are a {platform.replace('_', ' ').title()} content expert.

Generate engaging hashtags and video titles for this content.

VIDEO ANALYSIS:
- Duration: {duration:.1f}s
- Scene Changes: {scene_changes}
- Pacing: {"Fast" if pacing > 0.5 else "Medium" if pacing > 0.2 else "Slow"}
- Brightness: {"Bright" if brightness.get('is_bright') else "Dark" if brightness.get('is_dark') else "Normal"}
- Platform: {platform}
- Transcript: {transcript_text[:200]}...

Provide suggestions in this EXACT JSON format:
{{
  "hashtags": [
    "#hashtag1",
    "#hashtag2",
    "#hashtag3",
    "#hashtag4",
    "#hashtag5"
  ],
  "titles": [
    "Title option 1",
    "Title option 2",
    "Title option 3"
  ]
}}

HASHTAG RULES:
- Include 5 relevant hashtags
- Mix popular and niche hashtags
- Platform-specific trending tags
- Content-relevant tags
- No spaces in hashtags

TITLE RULES:
- 3 different title options
- Hook viewers in first 3 words
- Keep under 100 characters for {platform}
- Include keywords for discoverability
- Create curiosity or value proposition

Respond with ONLY the JSON, no markdown, no explanations."""

        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a social media content expert. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            content = response['message']['content']
            
            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            suggestions = json.loads(content)
            
            # Validate required fields
            if 'hashtags' not in suggestions or 'titles' not in suggestions:
                raise ValueError("Missing required fields in content suggestions")
            
            # Ensure hashtags start with #
            suggestions['hashtags'] = [
                tag if tag.startswith('#') else f"#{tag}"
                for tag in suggestions['hashtags']
            ]
            
            print(f"✅ Generated {len(suggestions['hashtags'])} hashtags and {len(suggestions['titles'])} titles")
            return suggestions
        
        except Exception as e:
            print(f"⚠️  Content suggestion generation failed: {str(e)}")
            # Return fallback suggestions
            platform_name = platform.replace('_', ' ').title()
            
            # Determine content type from pacing
            if pacing > 0.5:
                content_type = "fast-paced"
                hashtags = [
                    f"#{platform.replace('_', '')}",
                    "#viral",
                    "#trending",
                    "#fyp",
                    "#contentcreator"
                ]
                titles = [
                    f"🔥 This Will Blow Your Mind!",
                    f"You Won't Believe What Happens Next",
                    f"The Ultimate {platform_name} Video"
                ]
            elif pacing > 0.2:
                content_type = "medium-paced"
                hashtags = [
                    f"#{platform.replace('_', '')}",
                    "#content",
                    "#creative",
                    "#video",
                    "#explore"
                ]
                titles = [
                    f"Check Out This Amazing Content",
                    f"Something Special for You",
                    f"Must-Watch {platform_name} Video"
                ]
            else:
                content_type = "calm"
                hashtags = [
                    f"#{platform.replace('_', '')}",
                    "#chill",
                    "#relaxing",
                    "#aesthetic",
                    "#vibes"
                ]
                titles = [
                    f"Relax and Enjoy This Moment",
                    f"Peaceful Vibes for Your Feed",
                    f"Calm Content for {platform_name}"
                ]
            
            return {
                "hashtags": hashtags,
                "titles": titles
            }
