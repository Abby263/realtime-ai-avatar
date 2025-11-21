#!/usr/bin/env python3
"""
Test script to verify OpenAI API configuration and connectivity.
"""

import os
import sys
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_openai_api():
    """Test OpenAI API connection and basic functionality."""
    
    print("=" * 60)
    print("Testing OpenAI API Configuration")
    print("=" * 60)
    
    # Check for API key
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ ERROR: OPENAI_API_KEY environment variable not found!")
        print("\nPlease set your OpenAI API key:")
        print("  export OPENAI_API_KEY='sk-your-key-here'")
        print("\nOr create a .env file with:")
        print("  OPENAI_API_KEY=sk-your-key-here")
        return False
    
    print(f"✅ API Key found: {api_key[:7]}...{api_key[-4:]}")
    
    # Initialize OpenAI client
    try:
        print("\n📡 Initializing OpenAI client...")
        client = OpenAI(api_key=api_key)
        print("✅ OpenAI client initialized successfully")
    except Exception as e:
        print(f"❌ ERROR: Failed to initialize OpenAI client: {e}")
        return False
    
    # Test API call
    try:
        print("\n🧪 Testing API call with a simple completion...")
        print("   Sending test message: 'Hello, this is a test'")
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant. Respond briefly."
                },
                {
                    "role": "user",
                    "content": "Hello, this is a test. Please respond with 'API test successful!'"
                }
            ],
            max_tokens=50,
            temperature=0.7
        )
        
        assistant_message = response.choices[0].message.content
        print(f"\n✅ API call successful!")
        print(f"📝 Response: {assistant_message}")
        print(f"📊 Model used: {response.model}")
        print(f"📊 Tokens used: {response.usage.total_tokens if response.usage else 'N/A'}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: API call failed: {e}")
        print(f"   Error type: {type(e).__name__}")
        
        # Provide helpful error messages
        if "401" in str(e) or "authentication" in str(e).lower():
            print("\n💡 This looks like an authentication error.")
            print("   Please verify your API key is correct and has not expired.")
        elif "429" in str(e):
            print("\n💡 This looks like a rate limit error.")
            print("   You may have exceeded your API rate limits.")
        elif "insufficient_quota" in str(e).lower():
            print("\n💡 This looks like a quota error.")
            print("   Please check your OpenAI account billing and quota.")
        
        return False

if __name__ == "__main__":
    print("\n🚀 Starting OpenAI API test...\n")
    
    success = test_openai_api()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ All tests passed! OpenAI API is configured correctly.")
    else:
        print("❌ Tests failed. Please check the errors above.")
    print("=" * 60 + "\n")
    
    sys.exit(0 if success else 1)

