#!/usr/bin/env python3
"""
Test Ollama connection and JSON response
"""

import ollama
import json

def test_ollama():
    print("🧪 Testing Ollama Connection\n")
    
    # Test 1: Check if Ollama is running
    print("1️⃣ Checking Ollama connection...")
    try:
        models = ollama.list()
        print(f"✅ Ollama is running")
        if 'models' in models:
            model_names = [m.get('model', m.get('name', 'unknown')) for m in models['models']]
            print(f"📦 Available models: {model_names}")
        else:
            print(f"📦 Models response: {models}")
    except Exception as e:
        print(f"❌ Ollama connection failed: {e}")
        print("💡 Make sure Ollama is running: ollama serve")
        return False
    
    # Test 2: Test simple chat
    print("\n2️⃣ Testing simple chat...")
    try:
        response = ollama.chat(
            model='llama3.1:8b',
            messages=[
                {'role': 'user', 'content': 'Say "Hello" in one word'}
            ]
        )
        print(f"✅ Chat works: {response['message']['content']}")
    except Exception as e:
        print(f"❌ Chat failed: {e}")
        return False
    
    # Test 3: Test JSON response
    print("\n3️⃣ Testing JSON response...")
    try:
        response = ollama.chat(
            model='llama3.1:8b',
            messages=[
                {
                    'role': 'system',
                    'content': 'You are a JSON generator. Always respond with valid JSON only.'
                },
                {
                    'role': 'user',
                    'content': '''Generate a JSON object with this structure:
{
  "score": 8,
  "message": "Test successful"
}

Respond with ONLY the JSON, no markdown, no explanations.'''
                }
            ]
        )
        
        content = response['message']['content']
        print(f"📝 Raw response: {content}")
        
        # Try to parse JSON
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        result = json.loads(content)
        print(f"✅ JSON parsed successfully: {result}")
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing failed: {e}")
        print(f"📄 Content: {content}")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False
    
    print("\n" + "="*60)
    print("✅ All tests passed! Ollama is working correctly.")
    print("="*60)
    return True

if __name__ == "__main__":
    test_ollama()
