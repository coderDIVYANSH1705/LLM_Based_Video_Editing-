import librosa
import numpy as np
from pydub import AudioSegment
from pydub.silence import detect_silence
import tempfile
import os

class AudioAnalyzer:
    def __init__(self, video_path: str):
        self.video_path = video_path
        
    def analyze(self) -> dict:
        """Analyze audio quality metrics"""
        try:
            # Extract audio
            audio_path = self._extract_audio()
            
            # Load with librosa
            y, sr = librosa.load(audio_path, sr=None)
            
            metrics = {
                "duration": len(y) / sr,
                "sample_rate": sr,
                "loudness": self._analyze_loudness(y),
                "silence_gaps": self._detect_silence_gaps(audio_path),
                "noise_level": self._estimate_noise(y),
                "has_audio": len(y) > 0
            }
            
            # Cleanup
            if os.path.exists(audio_path):
                os.remove(audio_path)
            
            return metrics
        
        except Exception as e:
            return {
                "error": str(e),
                "has_audio": False
            }
    
    def _extract_audio(self) -> str:
        """Extract audio from video"""
        audio = AudioSegment.from_file(self.video_path)
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        audio.export(temp_audio.name, format="wav")
        return temp_audio.name
    
    def _analyze_loudness(self, y: np.ndarray) -> dict:
        """Analyze loudness (RMS)"""
        rms = librosa.feature.rms(y=y)[0]
        avg_rms = np.mean(rms)
        
        # Convert to dB
        db = 20 * np.log10(avg_rms) if avg_rms > 0 else -100
        
        return {
            "average_db": float(db),
            "is_too_quiet": db < -30,
            "is_too_loud": db > -10
        }
    
    def _detect_silence_gaps(self, audio_path: str) -> list:
        """Detect silence gaps"""
        audio = AudioSegment.from_file(audio_path)
        silences = detect_silence(audio, min_silence_len=500, silence_thresh=-40)
        
        return [
            {"start": s[0] / 1000, "end": s[1] / 1000}
            for s in silences[:5]  # Return first 5
        ]
    
    def _estimate_noise(self, y: np.ndarray) -> dict:
        """Estimate background noise"""
        # Simple noise estimation using spectral flatness
        spectral_flatness = librosa.feature.spectral_flatness(y=y)[0]
        avg_flatness = np.mean(spectral_flatness)
        
        return {
            "spectral_flatness": float(avg_flatness),
            "has_noise": avg_flatness > 0.5
        }
