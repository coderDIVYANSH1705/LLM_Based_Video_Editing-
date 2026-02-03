import whisper
import tempfile
from pydub import AudioSegment

class ContentAnalyzer:
    def __init__(self, video_path: str):
        self.video_path = video_path
        self.model = None
        
    def transcribe(self) -> dict:
        """Transcribe audio to text using Whisper"""
        try:
            # Extract audio
            audio_path = self._extract_audio()
            
            # Load Whisper model (lazy loading)
            if self.model is None:
                self.model = whisper.load_model("base")  # Use 'base' for speed
            
            # Transcribe
            result = self.model.transcribe(audio_path)
            
            return {
                "text": result["text"],
                "segments": [
                    {
                        "start": seg["start"],
                        "end": seg["end"],
                        "text": seg["text"]
                    }
                    for seg in result["segments"]
                ],
                "language": result.get("language", "unknown")
            }
        
        except Exception as e:
            return {
                "text": "",
                "segments": [],
                "error": str(e)
            }
    
    def _extract_audio(self) -> str:
        """Extract audio from video"""
        audio = AudioSegment.from_file(self.video_path)
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        audio.export(temp_audio.name, format="wav")
        return temp_audio.name
