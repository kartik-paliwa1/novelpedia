#!/usr/bin/env python
"""
Debug script to test OAuth components individually
"""

import os
import sys
import django
from pathlib import Path

# Add the server directory to Python path
server_dir = Path(__file__).parent
sys.path.append(str(server_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
    print("✅ Django setup successful")
except Exception as e:
    print(f"❌ Django setup failed: {e}")
    sys.exit(1)

def test_settings():
    """Test settings access"""
    print("\n🔧 Testing settings access...")
    try:
        from django.conf import settings
        
        client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', None)
        client_secret = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_SECRET', None)
        
        print(f"Client ID exists: {bool(client_id)}")
        print(f"Client ID length: {len(client_id) if client_id else 0}")
        print(f"Client Secret exists: {bool(client_secret)}")
        print(f"Client Secret length: {len(client_secret) if client_secret else 0}")
        
        if client_id and client_secret:
            print("✅ OAuth settings are properly configured")
            return True
        else:
            print("❌ OAuth settings missing")
            return False
            
    except Exception as e:
        print(f"❌ Settings access error: {e}")
        return False

def test_serializer_import():
    """Test OAuth serializer import"""
    print("\n📦 Testing serializer import...")
    try:
        from modules.accounts.oauth_serializers import GoogleOAuthSerializer
        print("✅ OAuth serializer imported successfully")
        
        # Try to instantiate
        serializer = GoogleOAuthSerializer()
        print("✅ OAuth serializer instantiated successfully")
        return True
        
    except Exception as e:
        print(f"❌ Serializer import/instantiation failed: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_user_model():
    """Test user model access"""
    print("\n👤 Testing user model...")
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        print(f"User model: {User}")
        print(f"Username field: {User.USERNAME_FIELD}")
        
        # Check if we can query users (tests DB connection)
        user_count = User.objects.count()
        print(f"Current user count: {user_count}")
        print("✅ User model access successful")
        return True
        
    except Exception as e:
        print(f"❌ User model access failed: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_requests_import():
    """Test requests library"""
    print("\n🌐 Testing requests library...")
    try:
        import requests
        
        # Try a simple request to Google (should work)
        response = requests.get("https://www.google.com", timeout=5)
        print(f"Google request status: {response.status_code}")
        print("✅ Requests library working")
        return True
        
    except Exception as e:
        print(f"❌ Requests library test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Starting OAuth diagnostic tests...\n")
    
    tests = [
        test_settings,
        test_serializer_import, 
        test_user_model,
        test_requests_import
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print(f"\n📊 Test Results: {sum(results)}/{len(results)} passed")
    
    if all(results):
        print("✅ All diagnostic tests passed! OAuth should work.")
    else:
        print("❌ Some tests failed. Check the errors above.")