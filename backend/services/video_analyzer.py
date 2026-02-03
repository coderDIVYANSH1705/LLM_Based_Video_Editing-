import cv2
import numpy as np
from pathlib import Path

class VideoAnalyzer:
    def __init__(self, video_path: str):
        self.video_path = video_path
        self.cap = cv2.VideoCapture(video_path)
        
    def analyze(self) -> dict:
        """Analyze video quality metrics"""
        metrics = {
            "duration": self._get_duration(),
            "resolution": self._get_resolution(),
            "fps": self._get_fps(),
            "brightness": self._analyze_brightness(),
            "blur_score": self._analyze_blur(),
            "scene_changes": self._detect_scene_changes(),
            "first_frame_quality": self._analyze_first_frame()
        }
        self.cap.release()
        return metrics
    
    def _get_duration(self) -> float:
        fps = self.cap.get(cv2.CAP_PROP_FPS)
        frame_count = self.cap.get(cv2.CAP_PROP_FRAME_COUNT)
        return frame_count / fps if fps > 0 else 0
    
    def _get_resolution(self) -> dict:
        width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        return {"width": width, "height": height}
    
    def _get_fps(self) -> float:
        return self.cap.get(cv2.CAP_PROP_FPS)
    
    def _analyze_brightness(self) -> dict:
        """Analyze brightness across video"""
        brightness_values = []
        frame_count = 0
        
        while frame_count < 30:  # Sample first 30 frames
            ret, frame = self.cap.read()
            if not ret:
                break
            
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            brightness_values.append(np.mean(gray))
            frame_count += 1
        
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Reset
        
        avg_brightness = np.mean(brightness_values) if brightness_values else 0
        return {
            "average": float(avg_brightness),
            "is_dark": avg_brightness < 80,
            "is_bright": avg_brightness > 180
        }
    
    def _analyze_blur(self) -> float:
        """Detect blur using Laplacian variance"""
        ret, frame = self.cap.read()
        if not ret:
            return 0.0
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Reset
        return float(laplacian_var)
    
    def _detect_scene_changes(self) -> int:
        """Count scene changes (simple frame difference)"""
        scene_changes = 0
        prev_frame = None
        frame_count = 0
        
        while frame_count < 60:  # Sample frames
            ret, frame = self.cap.read()
            if not ret:
                break
            
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            if prev_frame is not None:
                diff = cv2.absdiff(prev_frame, gray)
                if np.mean(diff) > 30:  # Threshold for scene change
                    scene_changes += 1
            
            prev_frame = gray
            frame_count += 1
        
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Reset
        return scene_changes
    
    def _analyze_first_frame(self) -> dict:
        """Analyze first 3 seconds (hook quality)"""
        ret, frame = self.cap.read()
        if not ret:
            return {"quality": "unknown"}
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(gray)
        blur = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Reset
        
        return {
            "brightness": float(brightness),
            "sharpness": float(blur),
            "quality": "good" if brightness > 80 and blur > 100 else "needs_improvement"
        }
