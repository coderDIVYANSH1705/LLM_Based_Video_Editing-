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
from services.thumbnail_suggester import ThumbnailSuggester

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
    print(f"\n{'='*60}")
    print(f"🎬 New video analysis request")
    print(f"📱 Platform: {platform}")
    print(f"📹 File: {video.filename}")
    print(f"{'='*60}\n")
    
    if platform not in ["instagram", "youtube_shorts", "other"]:
        raise HTTPException(status_code=400, detail="Invalid platform")
    
    # Validate video
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    # Save video temporarily
    video_path = UPLOAD_DIR / f"temp_{video.filename}"
    try:
        print("💾 Saving video...")
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        print(f"✅ Video saved to {video_path}")
        
        # Initialize analyzers
        print("\n🔧 Initializing analyzers...")
        video_analyzer = VideoAnalyzer(str(video_path))
        audio_analyzer = AudioAnalyzer(str(video_path))
        content_analyzer = ContentAnalyzer(str(video_path))
        llm_service = LLMService()
        
        # Run analysis
        print("\n🎥 Analyzing video...")
        video_metrics = video_analyzer.analyze()
        print(f"✅ Video metrics: {video_metrics}")
        
        print("\n🔊 Analyzing audio...")
        audio_metrics = audio_analyzer.analyze()
        print(f"✅ Audio metrics: {audio_metrics}")
        
        print("\n📝 Transcribing content...")
        transcript = content_analyzer.transcribe()
        print(f"✅ Transcript: {transcript.get('text', 'No speech')[:100]}...")
        
        # Get LLM insights
        print("\n🤖 Generating AI suggestions...")
        suggestions = llm_service.generate_suggestions(
            video_metrics=video_metrics,
            audio_metrics=audio_metrics,
            transcript=transcript,
            platform=platform
        )
        print(f"✅ Suggestions generated: {suggestions.get('overall_score', 'N/A')}")
        
        # Generate thumbnail suggestions
        print("\n🖼️  Generating thumbnail suggestions...")
        try:
            thumbnail_suggester = ThumbnailSuggester(str(video_path), platform)
            thumbnail_suggestions = thumbnail_suggester.generate_suggestions(num_suggestions=5)
            suggestions['thumbnail_suggestions'] = thumbnail_suggestions
            print(f"✅ Generated {len(thumbnail_suggestions)} thumbnail suggestions")
        except Exception as e:
            print(f"⚠️  Thumbnail generation failed: {str(e)}")
            suggestions['thumbnail_suggestions'] = []
        
        print(f"\n{'='*60}")
        print("✨ Analysis complete!")
        print(f"{'='*60}\n")
        
        return JSONResponse(content=suggestions)
    
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    finally:
        # Cleanup
        if video_path.exists():
            print(f"🗑️  Cleaning up {video_path}")
            video_path.unlink()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
