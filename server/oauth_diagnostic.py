#!/usr/bin/env python
"""
OAuth Debug Tool - Helps diagnose Google OAuth issues
"""

import os
import sys
import django
from pathlib import Path
import requests
import json

# Add the server directory to Python path
server_dir = Path(__file__).parent
sys.path.append(str(server_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
    from django.conf import settings
    print("✅ Django setup successful")
except Exception as e:
    print(f"❌ Django setup failed: {e}")
    sys.exit(1)

def test_oauth_config():
    """Test OAuth configuration"""
    print("\n🔧 Testing OAuth Configuration...")
    
    try:
        client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', None)
        client_secret = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_SECRET', None)
        
        print(f"Client ID: {client_id[:20]}...{client_id[-10:] if client_id else 'None'}")
        print(f"Client Secret: {'***' if client_secret else 'None'}")
        
        if client_id and client_secret:
            return True
        else:
            print("❌ Missing OAuth credentials")
            return False
            
    except Exception as e:
        print(f"❌ Error accessing settings: {e}")
        return False

def test_google_oauth_flow():
    """Test a complete OAuth flow simulation"""
    print("\n🌐 Testing Google OAuth Flow...")
    
    # Test the authorization URL generation
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    
    params = {
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'redirect_uri': 'http://localhost:8000/api/accounts/oauth/google/callback/',
        'scope': 'openid profile email',
        'response_type': 'code',
        'access_type': 'online',
        'include_granted_scopes': 'true',
        'prompt': 'consent',
        'state': 'test_state'
    }
    
    print("Authorization URL parameters:")
    for key, value in params.items():
        if key == 'client_id':
            print(f"  {key}: {value[:20]}...")
        else:
            print(f"  {key}: {value}")
    
    # Test token exchange with dummy code (will fail but shows us the flow)
    print("\nTesting token exchange endpoint...")
    token_url = "https://oauth2.googleapis.com/token"
    
    token_data = {
        'code': 'dummy_authorization_code',
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'redirect_uri': 'http://localhost:8000/api/accounts/oauth/google/callback/',
        'grant_type': 'authorization_code',
    }
    
    try:
        response = requests.post(token_url, data=token_data, timeout=10)
        print(f"Token exchange response status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            try:
                error_info = response.json()
                if error_info.get('error') == 'invalid_grant':
                    print("✅ Expected 'invalid_grant' error for dummy code - OAuth endpoint is working")
                    return True
            except:
                pass
                
    except Exception as e:
        print(f"❌ Token exchange test failed: {e}")
        return False
    
    return False

def test_google_userinfo_api():
    """Test Google userinfo API with dummy token"""
    print("\n👤 Testing Google Userinfo API...")
    
    endpoints = [
        'https://www.googleapis.com/oauth2/v1/userinfo',
        'https://www.googleapis.com/oauth2/v2/userinfo',
        'https://www.googleapis.com/userinfo/v2/me'
    ]
    
    headers = {'Authorization': 'Bearer dummy_access_token'}
    
    for endpoint in endpoints:
        try:
            response = requests.get(endpoint, headers=headers, timeout=5)
            print(f"{endpoint}: Status {response.status_code}")
            
            if response.status_code == 401:
                print("  ✅ Expected 401 Unauthorized for dummy token")
            else:
                print(f"  Response: {response.text[:100]}...")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")

if __name__ == "__main__":
    print("🧪 OAuth Diagnostic Tool\n")
    
    tests = [
        ("OAuth Configuration", test_oauth_config),
        ("Google OAuth Flow", test_google_oauth_flow),
        ("Google Userinfo API", test_google_userinfo_api)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running: {test_name}")
        print('='*50)
        
        try:
            result = test_func()
            results.append(result)
        except Exception as e:
            print(f"❌ Test {test_name} failed with exception: {e}")
            results.append(False)
    
    print(f"\n{'='*50}")
    print("SUMMARY")
    print('='*50)
    
    for i, (test_name, _) in enumerate(tests):
        status = "✅ PASS" if results[i] else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {sum(results)}/{len(results)} tests passed")
    
    if all(results):
        print("\n🎉 All diagnostic tests passed!")
        print("OAuth configuration appears to be correct.")
        print("\n💡 If you're still having issues, the problem might be:")
        print("  1. Authorization code reuse (codes can only be used once)")
        print("  2. Timing issues (codes expire in 10 minutes)")
        print("  3. Browser caching issues")
        print("  4. Google Cloud Console redirect URI configuration")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")