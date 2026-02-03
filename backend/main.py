from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
from pathlib import Path
from dotenv import load_dotenv

from services.video_analyzer import VideoAnalyzer
from services.audio_analyzer import AudioAnalyzer
from services.content_analyzer import ContentAnalyzer
from services.llm_service import LLMService

load_dotenv()

app = FastAPI(title="AI Reel Optimizer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/")
def root():
    return {"message": "AI Reel Optimizer API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "llm_provider": os.getenv("LLM_PROVIDER", "ollama")}

@app.post("/api/analyze")
async def analyze_video(
    video: UploadFile = File(...),
    platform: str = Form(...)
):
    """
    Analyze uploaded video and return optimization suggestions
    """
    if platform not in ["instagram", "youtube_shorts", "other"]:
        raise HTTPException(status_code=400, detail="Invalid platform")
    
    # Validate video
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    # Save video temporarily
    video_path = UPLOAD_DIR / f"temp_{video.filename}"
    try:
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        
        # Initialize analyzers
        video_analyzer = VideoAnalyzer(str(video_path))
        audio_analyzer = AudioAnalyzer(str(video_path))
        content_analyzer = ContentAnalyzer(str(video_path))
        llm_service = LLMService()
        
        # Run analysis
        video_metrics = video_analyzer.analyze()
        audio_metrics = audio_analyzer.analyze()
        transcript = content_analyzer.transcribe()
        
        # Get LLM insights
        suggestions = llm_service.generate_suggestions(
            video_metrics=video_metrics,
            audio_metrics=audio_metrics,
            transcript=transcript,
            platform=platform
        )
        
        return JSONResponse(content=suggestions)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    finally:
        # Cleanup
        if video_path.exists():
            video_path.unlink()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
