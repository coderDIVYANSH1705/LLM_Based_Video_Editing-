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
