#!/usr/bin/env python
"""
Test Google OAuth API call to debug token validation
"""

import requests
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_google_api_endpoints():
    """
    Test different Google API endpoints to see which one works
    """
    # These are the different Google userinfo endpoints
    endpoints = [
        'https://www.googleapis.com/oauth2/v1/userinfo',
        'https://www.googleapis.com/oauth2/v2/userinfo',
        'https://www.googleapis.com/userinfo/v2/me'
    ]
    
    # Test with a dummy token (this will fail but shows us the response format)
    test_token = "dummy_token_for_testing"
    
    for endpoint in endpoints:
        print(f"\n🧪 Testing endpoint: {endpoint}")
        
        # Method 1: Using Authorization header (Bearer token)
        headers = {'Authorization': f'Bearer {test_token}'}
        try:
            response = requests.get(endpoint, headers=headers, timeout=5)
            print(f"   Bearer method - Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
        except Exception as e:
            print(f"   Bearer method - Error: {e}")
        
        # Method 2: Using query parameter
        try:
            response = requests.get(f"{endpoint}?access_token={test_token}", timeout=5)
            print(f"   Query param method - Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
        except Exception as e:
            print(f"   Query param method - Error: {e}")

def test_token_validation_format():
    """
    Test token validation with proper error handling
    """
    print("\n🔍 Testing token validation format...")
    
    # Test the exact method we use in our serializer
    test_token = "test_access_token_format"
    
    try:
        headers = {'Authorization': f'Bearer {test_token}'}
        google_user_info_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
        
        print(f"Making request to: {google_user_info_url}")
        print(f"Headers: {headers}")
        
        response = requests.get(google_user_info_url, headers=headers, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 401:
            print("✅ Got expected 401 Unauthorized for dummy token")
        else:
            print(f"❓ Unexpected status code: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    print("🚀 Testing Google OAuth API endpoints...\n")
    test_google_api_endpoints()
    test_token_validation_format()
    print("\n✅ API endpoint testing completed!")