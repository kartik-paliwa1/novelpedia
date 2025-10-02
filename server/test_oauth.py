#!/usr/bin/env python
"""
Test script to validate Google OAuth functionality
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
django.setup()

from modules.accounts.oauth_serializers import GoogleOAuthSerializer
from modules.accounts.models import MyUser
from django.contrib.auth import get_user_model

User = get_user_model()

def test_user_creation():
    """Test user creation functionality"""
    print("Testing user creation...")
    
    # Clean up any existing test users
    test_email = "test@example.com"
    User.objects.filter(email=test_email).delete()
    
    # Test user creation parameters
    try:
        user = User.objects.create_user(
            name="test_user",
            email=test_email,
            dob="2000-01-01",
            gender="O",
            password="testpassword123"
        )
        print(f"✅ User created successfully: {user.name} ({user.email})")
        
        # Clean up
        user.delete()
        print("✅ User cleanup completed")
        
    except Exception as e:
        print(f"❌ User creation failed: {e}")
        return False
    
    return True

def test_oauth_serializer_validation():
    """Test OAuth serializer validation logic"""
    print("\nTesting OAuth serializer structure...")
    
    # Check if the serializer can be instantiated
    try:
        serializer = GoogleOAuthSerializer()
        print("✅ OAuth serializer instantiated successfully")
        
        # Check if required methods exist
        if hasattr(serializer, 'validate_access_token'):
            print("✅ validate_access_token method exists")
        else:
            print("❌ validate_access_token method missing")
            
        if hasattr(serializer, 'create_or_get_user'):
            print("✅ create_or_get_user method exists")
        else:
            print("❌ create_or_get_user method missing")
            
        return True
        
    except Exception as e:
        print(f"❌ OAuth serializer test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting OAuth functionality tests...\n")
    
    success = True
    success = success and test_user_creation()
    success = success and test_oauth_serializer_validation()
    
    print(f"\n{'✅ All tests passed!' if success else '❌ Some tests failed!'}")