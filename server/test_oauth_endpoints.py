#!/usr/bin/env python3
"""
Simple test script to verify Google OAuth endpoints are working.
Run this from the server directory after starting the Django server.
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/accounts"

def test_oauth_status():
    """Test the OAuth status endpoint"""
    print("Testing OAuth status endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/oauth/status/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_social_providers():
    """Test the social providers endpoint"""
    print("\nTesting social providers endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/social/providers/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_google_login_start():
    """Test starting Google OAuth login"""
    print("\nTesting Google OAuth login start...")
    try:
        data = {
            "redirect_uri": "http://localhost:3000/login",
            "state": "test_state_123"
        }
        response = requests.post(f"{BASE_URL}/social/google/login/", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("Google OAuth Backend Test")
    print("=" * 30)
    
    tests = [
        ("OAuth Status", test_oauth_status),
        ("Social Providers", test_social_providers),
        ("Google Login Start", test_google_login_start),
    ]
    
    results = []
    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))
    
    print("\n" + "=" * 30)
    print("Test Results:")
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(result for _, result in results)
    print(f"\nOverall: {'✓ All tests passed!' if all_passed else '✗ Some tests failed'}")

if __name__ == "__main__":
    main()