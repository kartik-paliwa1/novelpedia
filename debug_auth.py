#!/usr/bin/env python3
"""
Script to help debug the 400 Bad Request error by testing various scenarios
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_public_endpoint():
    """Test a public endpoint that doesn't require authentication"""
    print("🧪 Testing public endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/novels/")
        print(f"   ✅ GET /api/novels/ -> {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('results', data)) if isinstance(data, dict) else len(data)
            print(f"   📊 Found {count} public novels")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   💥 Exception: {e}")

def test_authenticated_endpoint_without_token():
    """Test the problematic endpoint without authentication"""
    print("\n🔐 Testing authenticated endpoint without token...")
    try:
        response = requests.get(f"{BASE_URL}/author/novels/fefef/")
        print(f"   ❌ GET /api/author/novels/fefef/ -> {response.status_code}")
        print(f"   📝 Response: {response.text}")
    except Exception as e:
        print(f"   💥 Exception: {e}")

def test_authenticated_endpoint_with_invalid_token():
    """Test the authenticated endpoint with an invalid token"""
    print("\n🔑 Testing authenticated endpoint with invalid token...")
    try:
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = requests.get(f"{BASE_URL}/author/novels/fefef/", headers=headers)
        print(f"   ❌ GET /api/author/novels/fefef/ -> {response.status_code}")
        print(f"   📝 Response: {response.text}")
    except Exception as e:
        print(f"   💥 Exception: {e}")

def test_novel_exists():
    """Check if the novel with slug 'fefef' exists in public view"""
    print("\n📖 Testing if novel 'fefef' exists publicly...")
    try:
        response = requests.get(f"{BASE_URL}/novels/fefef/")
        print(f"   GET /api/novels/fefef/ -> {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Novel found: '{data.get('title', 'Unknown Title')}'")
            print(f"   👤 Author: {data.get('author', 'Unknown Author')}")
        else:
            print(f"   ❌ Novel not found publicly: {response.text}")
    except Exception as e:
        print(f"   💥 Exception: {e}")

def main():
    print("🔍 Django API Authentication Debugging")
    print("=" * 50)
    
    test_public_endpoint()
    test_authenticated_endpoint_without_token()
    test_authenticated_endpoint_with_invalid_token()
    test_novel_exists()
    
    print("\n" + "=" * 50)
    print("📋 Summary:")
    print("- The /api/author/novels/ endpoints require authentication")
    print("- Use /api/novels/ for public novel access")
    print("- Make sure the frontend sends valid JWT tokens")
    print("- Check browser dev tools for authentication headers")

if __name__ == "__main__":
    main()