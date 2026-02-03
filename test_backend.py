#!/usr/bin/env python3
"""
Quick test script to verify backend is working
"""

import requests
import sys

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing AI Reel Optimizer Backend...\n")
    
    # Test 1: Health check
    print("1️⃣ Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Backend is healthy")
            print(f"   📊 LLM Provider: {data.get('llm_provider')}")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Cannot connect to backend: {e}")
        print(f"   💡 Make sure backend is running: cd backend && python main.py")
        return False
    
    # Test 2: Root endpoint
    print("\n2️⃣ Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print(f"   ✅ Root endpoint working")
        else:
            print(f"   ❌ Root endpoint failed")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Check Ollama
    print("\n3️⃣ Testing Ollama connection...")
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json().get('models', [])
            print(f"   ✅ Ollama is running")
            print(f"   📦 Available models: {len(models)}")
            for model in models:
                print(f"      - {model.get('name')}")
        else:
            print(f"   ⚠️  Ollama might not be running")
            print(f"   💡 Start it with: ollama serve")
    except Exception as e:
        print(f"   ⚠️  Cannot connect to Ollama: {e}")
        print(f"   💡 Start it with: ollama serve")
    
    print("\n" + "="*50)
    print("✅ Backend tests completed!")
    print("="*50)
    print("\n📱 Next steps:")
    print("   1. Start frontend: cd frontend && npm run dev")
    print("   2. Open browser: http://localhost:3000")
    print("   3. Upload a video and test!")
    
    return True

if __name__ == "__main__":
    success = test_backend()
    sys.exit(0 if success else 1)
