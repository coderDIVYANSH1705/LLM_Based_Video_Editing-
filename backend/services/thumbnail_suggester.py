import cv2
import numpy as np
import base64
from typing import List, Tuple, Dict, Any
from pathlib import Path

class ThumbnailSuggester:
    def __init__(self, video_path: str, platform: str):
        self.video_path = video_path
        self.platform = platform
        self.cap = cv2.VideoCapture(video_path)
        
        # Load face detection cascade
        try:
            self.face_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )
        except:
            print("⚠️  Face detection cascade not found, face detection will be disabled")
            self.face_cascade = None
    
    def generate_suggestions(self, num_suggestions: int = 5) -> List[Dict[str, Any]]:
        """Generate top N thumbnail suggestions from video"""
        print(f"\n🖼️  Generating thumbnail suggestions...")
        
        # Extract key frames
        frames = self._extract_key_frames(interval_seconds=2.0)
        print(f"✅ Extracted {len(frames)} key frames")
        
        if not frames:
            print("❌ No frames extracted")
            return []
        
        # Score each frame
        scored_frames = []
        for timestamp, frame in frames:
            quality_metrics = self._score_frame_quality(frame)
            face_data = self._detect_faces(frame)
            composition_score = self._score_composition(frame)
            color_score = self._score_color_vibrancy(frame)
            text_data = self._detect_text_overlay(frame)
            
            # Combine all metrics
            combined_score = self._calculate_combined_score({
                'sharpness': quality_metrics['sharpness'],
                'brightness': quality_metrics['brightness'],
                'contrast': quality_metrics['contrast'],
                'face_detected': face_data[0],
                'face_prominence': face_data[2],
                'composition_score': composition_score,
                'color_vibrancy': color_score,
                'text_visibility': text_data[1]
            }, self.platform)
            
            scored_frames.append({
                'timestamp': timestamp,
                'frame': frame,
                'score': combined_score,
                'quality_metrics': {
                    'sharpness': quality_metrics['sharpness'],
                    'brightness': quality_metrics['brightness'],
                    'contrast': quality_metrics['contrast'],
                    'face_detected': face_data[0],
                    'face_count': face_data[1],
                    'composition_score': composition_score,
                    'color_vibrancy': color_score
                }
            })
        
        # Sort by score and select top N
        scored_frames.sort(key=lambda x: x['score'], reverse=True)
        top_frames = scored_frames[:num_suggestions]
        
        # Mark the best one as recommended
        if top_frames:
            top_frames[0]['is_recommended'] = True
        
        # Generate preview images and reasoning
        suggestions = []
        for i, frame_data in enumerate(top_frames):
            preview_image = self._generate_preview_image(frame_data['frame'])
            reasoning = self._generate_reasoning(frame_data, i == 0)
            
            suggestions.append({
                'timestamp': frame_data['timestamp'],
                'score': round(frame_data['score'], 1),
                'preview_image': preview_image,
                'reasoning': reasoning,
                'is_recommended': frame_data.get('is_recommended', False),
                'quality_metrics': frame_data['quality_metrics']
            })
        
        self.cap.release()
        print(f"✅ Generated {len(suggestions)} thumbnail suggestions")
        return suggestions
    
    def _extract_key_frames(self, interval_seconds: float = 2.0) -> List[Tuple[float, np.ndarray]]:
        """Extract frames at regular intervals throughout video"""
        frames = []
        fps = self.cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if fps <= 0:
            return frames
        
        frame_interval = int(fps * interval_seconds)
        
        for frame_num in range(0, total_frames, frame_interval):
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
            ret, frame = self.cap.read()
            
            if ret:
                timestamp = frame_num / fps
                frames.append((timestamp, frame))
        
        return frames
    
    def _score_frame_quality(self, frame: np.ndarray) -> Dict[str, float]:
        """Score frame based on visual quality metrics"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Sharpness (Laplacian variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness = min(100, laplacian_var / 10)  # Normalize to 0-100
        
        # Brightness
        brightness = np.mean(gray)
        brightness_score = 100 - abs(brightness - 127) / 1.27  # Optimal at 127
        
        # Contrast (standard deviation)
        contrast = np.std(gray)
        contrast_score = min(100, contrast / 0.8)  # Normalize to 0-100
        
        return {
            'sharpness': float(sharpness),
            'brightness': float(brightness_score),
            'contrast': float(contrast_score)
        }
    
    def _detect_faces(self, frame: np.ndarray) -> Tuple[bool, int, float]:
        """Detect faces and return (has_faces, face_count, prominence_score)"""
        if self.face_cascade is None:
            return (False, 0, 0.0)
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )
        
        has_faces = len(faces) > 0
        face_count = len(faces)
        
        # Calculate prominence (size and position)
        prominence = 0.0
        if has_faces:
            frame_area = frame.shape[0] * frame.shape[1]
            for (x, y, w, h) in faces:
                face_area = w * h
                prominence += (face_area / frame_area) * 100
            prominence = min(100, prominence)
        
        return (has_faces, face_count, float(prominence))
    
    def _score_composition(self, frame: np.ndarray) -> float:
        """Score frame composition using rule of thirds"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        
        h, w = edges.shape
        
        # Rule of thirds intersection points
        third_h = h // 3
        third_w = w // 3
        
        intersections = [
            (third_w, third_h),
            (2 * third_w, third_h),
            (third_w, 2 * third_h),
            (2 * third_w, 2 * third_h)
        ]
        
        # Check edge density at intersection points
        score = 0.0
        region_size = 50
        
        for x, y in intersections:
            x1 = max(0, x - region_size // 2)
            x2 = min(w, x + region_size // 2)
            y1 = max(0, y - region_size // 2)
            y2 = min(h, y + region_size // 2)
            
            region = edges[y1:y2, x1:x2]
            density = np.sum(region) / (region.size * 255)
            score += density
        
        # Normalize to 0-100
        composition_score = min(100, score * 100)
        return float(composition_score)
    
    def _score_color_vibrancy(self, frame: np.ndarray) -> float:
        """Score color vibrancy and visual appeal"""
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Saturation (vibrancy)
        saturation = hsv[:, :, 1]
        avg_saturation = np.mean(saturation)
        
        # Value (brightness variation)
        value = hsv[:, :, 2]
        value_std = np.std(value)
        
        # Combine metrics
        vibrancy_score = (avg_saturation / 2.55) * 0.7 + (value_std / 1.28) * 0.3
        
        return float(min(100, vibrancy_score))
    
    def _detect_text_overlay(self, frame: np.ndarray) -> Tuple[bool, float]:
        """Detect text/overlays and score visibility"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Use edge detection as proxy for text
        edges = cv2.Canny(gray, 100, 200)
        edge_density = np.sum(edges) / (edges.size * 255)
        
        # High edge density in specific regions suggests text
        has_text = edge_density > 0.1
        visibility_score = min(100, edge_density * 500)
        
        return (has_text, float(visibility_score))
    
    def _calculate_combined_score(
        self,
        quality_metrics: Dict[str, float],
        platform: str
    ) -> float:
        """Calculate combined score with platform-specific weights"""
        
        # Platform-specific weights
        if platform == 'instagram':
            weights = {
                'sharpness': 0.20,
                'brightness': 0.15,
                'contrast': 0.10,
                'face_prominence': 0.25,  # Instagram loves faces
                'composition_score': 0.15,
                'color_vibrancy': 0.15
            }
        elif platform == 'youtube_shorts':
            weights = {
                'sharpness': 0.25,
                'brightness': 0.15,
                'contrast': 0.15,
                'face_prominence': 0.10,
                'composition_score': 0.20,  # YouTube values composition
                'color_vibrancy': 0.15
            }
        else:  # other
            weights = {
                'sharpness': 0.20,
                'brightness': 0.15,
                'contrast': 0.15,
                'face_prominence': 0.15,
                'composition_score': 0.20,
                'color_vibrancy': 0.15
            }
        
        # Calculate weighted score
        score = 0.0
        score += quality_metrics['sharpness'] * weights['sharpness']
        score += quality_metrics['brightness'] * weights['brightness']
        score += quality_metrics['contrast'] * weights['contrast']
        score += quality_metrics['face_prominence'] * weights['face_prominence']
        score += quality_metrics['composition_score'] * weights['composition_score']
        score += quality_metrics['color_vibrancy'] * weights['color_vibrancy']
        
        return float(score)
    
    def _generate_preview_image(self, frame: np.ndarray) -> str:
        """Generate thumbnail preview as base64 JPEG"""
        # Resize to 320x180 (16:9 aspect ratio)
        preview = cv2.resize(frame, (320, 180), interpolation=cv2.INTER_AREA)
        
        # Encode as JPEG
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 80]
        _, buffer = cv2.imencode('.jpg', preview, encode_param)
        
        # Convert to base64
        jpg_as_text = base64.b64encode(buffer).decode('utf-8')
        
        return f"data:image/jpeg;base64,{jpg_as_text}"
    
    def _generate_reasoning(self, frame_data: Dict[str, Any], is_best: bool) -> str:
        """Generate human-readable reasoning for thumbnail suggestion"""
        metrics = frame_data['quality_metrics']
        timestamp = frame_data['timestamp']
        
        reasons = []
        
        # Sharpness
        if metrics['sharpness'] > 70:
            reasons.append("sharp and clear image")
        elif metrics['sharpness'] < 40:
            reasons.append("image could be sharper")
        
        # Brightness
        if 60 < metrics['brightness'] < 90:
            reasons.append("well-lit")
        elif metrics['brightness'] < 50:
            reasons.append("slightly dark")
        elif metrics['brightness'] > 90:
            reasons.append("very bright")
        
        # Faces
        if metrics['face_detected']:
            if metrics['face_count'] == 1:
                reasons.append("prominent face in frame")
            else:
                reasons.append(f"{metrics['face_count']} faces visible")
        
        # Composition
        if metrics['composition_score'] > 60:
            reasons.append("good composition")
        
        # Color
        if metrics['color_vibrancy'] > 70:
            reasons.append("vibrant colors")
        
        # Build reasoning text
        if is_best:
            reasoning = f"Best thumbnail at {timestamp:.1f}s: " + ", ".join(reasons[:3])
        else:
            reasoning = f"Good option at {timestamp:.1f}s: " + ", ".join(reasons[:3])
        
        return reasoning + ". This frame would make an eye-catching thumbnail."
