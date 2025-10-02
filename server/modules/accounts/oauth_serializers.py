# Welcome to the OAuth serializers file for our 'accounts' module!
# This is where we handle Google OAuth authentication and convert it to our JWT tokens.
# Social login made simple! 🔐

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
import requests
import logging
from django.apps import apps as django_apps
from django.db import DatabaseError

logger = logging.getLogger(__name__)
User = get_user_model()

class GoogleOAuthSerializer(serializers.Serializer):
    """
    Serializer to handle Google OAuth authentication.
    Takes an access_token from Google and creates/authenticates a user.
    """
    access_token = serializers.CharField(required=True, help_text="Google OAuth access token")
    
    def validate_access_token(self, access_token):
        """
        Validate the Google access token format and return the cleaned token.
        This method should only validate and return the token, not fetch user data.
        """
        # Handle different access_token types
        if isinstance(access_token, dict):
            logger.error(f"Received dict instead of string for access_token: {access_token}")
            raise serializers.ValidationError("Invalid access token format - expected string")
        
        # Clean the access token (remove any whitespace) - ensure it's a string
        access_token = str(access_token).strip() if access_token else ''
        
        if not access_token or access_token == 'None':
            logger.error("Empty access token provided")
            raise serializers.ValidationError("Access token is required")
        
        token_preview = access_token[:10] + '...' if access_token and len(access_token) > 10 else access_token
        logger.info(f"Validating token length: {len(access_token)}, starts with: {token_preview}")
        
        # Return the cleaned access token string
        return access_token
    
    def get_google_user_data(self, access_token):
        """
        Get Google user data using the access token
        """
        # Try multiple Google API endpoints in order of preference
        endpoints = [
            'https://www.googleapis.com/oauth2/v1/userinfo',
            'https://www.googleapis.com/oauth2/v2/userinfo',
            'https://www.googleapis.com/userinfo/v2/me'
        ]
        
        headers = {'Authorization': f'Bearer {access_token}'}
        
        for endpoint in endpoints:
            try:
                logger.info(f"Trying Google API endpoint: {endpoint}")
                response = requests.get(endpoint, headers=headers, timeout=10)
                
                logger.info(f"Google API response status: {response.status_code}")
                
                if response.status_code == 200:
                    user_data = response.json()
                    logger.info(f"Google user data received from {endpoint}: {user_data.keys()}")
                    
                    # Check if we have the required fields
                    if user_data.get('email'):
                        logger.info(f"Successfully validated token with endpoint: {endpoint}")
                        return user_data
                    else:
                        logger.warning(f"No email in response from {endpoint}: {user_data}")
                        continue
                        
                else:
                    logger.warning(f"Failed with {endpoint}: {response.status_code} - {response.text}")
                    continue
                    
            except requests.RequestException as e:
                logger.warning(f"Request exception with {endpoint}: {e}")
                continue
        
        # If we get here, all endpoints failed
        logger.error("All Google API endpoints failed")
        raise serializers.ValidationError("Invalid Google access token - unable to verify with any Google API endpoint")
    
    def create_or_get_user(self, google_user_data):
        """
        Create or get user based on Google user data
        """
        email = google_user_data.get('email')
        google_id = google_user_data.get('id')
        name = google_user_data.get('name', email.split('@')[0])  # Use email prefix if no name
        
        # Try to find existing user by email
        user = None
        try:
            user = User.objects.get(email=email)
            logger.info(f"Found existing user with email: {email}")
        except User.DoesNotExist:
            # Create new user
            try:
                # Generate a unique username if name is taken
                username = name.replace(' ', '_').lower()  # Clean the name
                counter = 1
                original_username = username
                while User.objects.filter(name=username).exists():
                    username = f"{original_username}_{counter}"
                    counter += 1
                
                random_password = User.objects.make_random_password(length=32)
                
                user = User.objects.create_user(
                    name=username,
                    email=email,
                    dob='2000-01-01',  # Default DOB, user can update later
                    gender='O',  # Default gender as 'Other'
                    password=random_password  # Random password for OAuth users
                )
                logger.info(f"Created new user with email: {email} and name: {username}")
            except Exception as e:
                logger.error(f"Error creating user: {e}")
                logger.error(f"User data: email={email}, name={username}")
                raise serializers.ValidationError(f"Unable to create user account: {str(e)}")
        
        # Create or update social account link (optional - skip if table/app not ready)
        try:
            SocialAccountModel = django_apps.get_model('socialaccount', 'SocialAccount')
        except Exception:
            SocialAccountModel = None

        if SocialAccountModel is not None:
            try:
                social_account, created = SocialAccountModel.objects.get_or_create(
                    user=user,
                    provider='google',
                    defaults={
                        'uid': google_id,
                        'extra_data': google_user_data
                    }
                )

                if not created and getattr(social_account, 'uid', None) != google_id:
                    # Update the social account if Google ID changed
                    social_account.uid = google_id
                    social_account.extra_data = google_user_data
                    social_account.save()
            except DatabaseError as db_err:
                logger.warning(f"Skipping SocialAccount linking; database not ready: {db_err}")
            except Exception as e:
                logger.warning(f"Skipping SocialAccount linking due to error: {e}")
        
        return user
    
    def get_tokens_for_user(self, user):
        """
        Generate JWT tokens for the user
        """
        refresh = RefreshToken.for_user(user)
        
        # Add custom claims
        refresh['name'] = user.name
        refresh['email'] = user.email
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    def validate(self, attrs):
        import time
        request_id = f"serial_{int(time.time() * 1000000) % 1000000}"
        logger.info(f"[{request_id}] OAuth validate called with attrs: {attrs}")
        logger.info(f"[{request_id}] attrs type: {type(attrs)}")
        
        access_token = attrs.get('access_token')
        logger.info(f"[{request_id}] Extracted access_token: {access_token}")
        logger.info(f"[{request_id}] access_token type: {type(access_token)}")
        
        if isinstance(access_token, dict):
            logger.error(f"PROBLEM: access_token is a dict when it should be a string: {access_token}")
            raise serializers.ValidationError("Invalid access token format - expected string")
        
        token_preview = access_token[:20] + '...' if access_token and len(access_token) > 20 else str(access_token) if access_token else 'No token provided'
        logger.info(f"Starting OAuth validation with token: {token_preview}")
        
        try:
            # Get Google user data using the validated access token
            google_user_data = self.get_google_user_data(access_token)
            logger.info(f"Google user data validation successful for email: {google_user_data.get('email')}")
            
            # Create or get the user
            user = self.create_or_get_user(google_user_data)
            logger.info(f"User creation/retrieval successful: {user.email}")
            
            if not user.is_active:
                logger.error(f"User account is disabled: {user.email}")
                raise serializers.ValidationError("User account is disabled")
            
            # Generate tokens
            tokens = self.get_tokens_for_user(user)
            logger.info(f"JWT tokens generated successfully for user: {user.email}")
            
            return {
                'user': user,
                'tokens': tokens,
                'google_data': google_user_data
            }
            
        except serializers.ValidationError as e:
            logger.error(f"OAuth validation error: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during OAuth validation: {e}")
            raise serializers.ValidationError(f"Authentication failed: {str(e)}")

# And that's our Google OAuth serializer! 
# It handles the entire OAuth flow and gives us JWT tokens just like our regular login. 🎉
