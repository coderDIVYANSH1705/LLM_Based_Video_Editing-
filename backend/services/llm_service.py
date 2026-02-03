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
            response = ollama.chat(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a video optimization expert. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            # Parse JSON response
            content = response['message']['content']
            
            # Extract JSON from markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            return json.loads(content)
        
        except Exception as e:
            return {
                "error": f"LLM analysis failed: {str(e)}",
                "platform": "unknown",
                "overall_score": 0
            }
