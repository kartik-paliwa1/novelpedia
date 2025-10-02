# Welcome to the OAuth views file for our 'accounts' module!
# This is where we handle Google OAuth authentication endpoints.
# Making social login as easy as clicking a button! 🚀

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from django.urls import reverse
from django.http import HttpResponseRedirect
from .oauth_serializers import GoogleOAuthSerializer
from .serializers import UserSerializer
import logging
import urllib.parse

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_oauth_login(request):
    """
    Handle Google OAuth login.
    
    Expected payload:
    {
        "access_token": "google_access_token_here"
    }
    
    Returns JWT tokens and user data on successful authentication.
    """
    try:
        serializer = GoogleOAuthSerializer(data=request.data)
        
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user = validated_data['user']
            tokens = validated_data['tokens']
            
            # Return response similar to regular login
            return Response({
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'user': UserSerializer(user).data,
                'message': 'Google OAuth login successful!'
            }, status=status.HTTP_200_OK)
        
        else:
            return Response({
                'error': 'Authentication failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Google OAuth error: {str(e)}")
        return Response({
            'error': 'Internal server error during OAuth authentication',
            'details': str(e) if settings.DEBUG else 'Authentication failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_config(request):
    """
    Return Google OAuth configuration for frontend.
    
    This endpoint provides the necessary configuration for the frontend
    to initiate Google OAuth flow.
    """
    try:
        import time
        callback_uri = request.build_absolute_uri(reverse('google_oauth_callback'))
        config = {
            'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
            'redirect_uri': callback_uri,
            'scope': 'openid profile email',
            'response_type': 'code',
            'access_type': 'online',
            'include_granted_scopes': 'true',
            'prompt': 'consent',  # Force fresh consent to get fresh codes
            'state': f'oauth_request_{int(time.time())}'  # Unique state to prevent reuse
        }
        
        if not config['client_id']:
            return Response({
                'error': 'Google OAuth not configured',
                'details': 'GOOGLE_OAUTH2_CLIENT_ID not set'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response({
            'google_oauth_config': config,
            'auth_url': f"https://accounts.google.com/o/oauth2/v2/auth"
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error getting OAuth config: {str(e)}")
        return Response({
            'error': 'Unable to get OAuth configuration'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_callback(request):
    """
    Handle Google OAuth callback with authorization code.
    
    This endpoint receives the authorization code from Google and:
    1. Exchanges it for an access token
    2. Authenticates the user
    3. Redirects to frontend with tokens
    """
    try:
        # Get authorization code and state from query parameters
        code = request.GET.get('code')
        state = request.GET.get('state')
        error = request.GET.get('error')
        
        if error:
            # Redirect to frontend with error
            frontend_url = f"http://localhost:3000/login?error={error}"
            return HttpResponseRedirect(frontend_url)
        
        if not code:
            frontend_url = "http://localhost:3000/login?error=no_code"
            return HttpResponseRedirect(frontend_url)
        
        # Check settings configuration
        try:
            client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', None)
            client_secret = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_SECRET', None)
            
            logger.info(f"OAuth settings check - Client ID exists: {bool(client_id)}, Client Secret exists: {bool(client_secret)}")
            
            if not client_id or not client_secret:
                logger.error("Missing Google OAuth credentials in settings")
                frontend_url = "http://localhost:3000/login?error=oauth_not_configured"
                return HttpResponseRedirect(frontend_url)
        except Exception as settings_error:
            logger.error(f"Settings access error: {settings_error}")
            frontend_url = "http://localhost:3000/login?error=settings_error"
            return HttpResponseRedirect(frontend_url)
        
        # Exchange authorization code for access token
        import requests
        token_url = "https://oauth2.googleapis.com/token"

        # Must exactly match the redirect_uri used in the auth request
        redirect_uri = request.build_absolute_uri(reverse('google_oauth_callback'))
        
        token_data = {
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }
        
        logger.info(f"Token exchange request data: {dict(token_data, client_secret='***')}")
        logger.info(f"Using redirect_uri: {redirect_uri}")
        code_preview = code[:20] + '...' if code and len(code) > 20 else str(code) if code else 'No code'
        logger.info(f"Authorization code: {code_preview}")
        
        token_response = requests.post(token_url, data=token_data)
        
        logger.info(f"Token response status: {token_response.status_code}")
        logger.info(f"Token response text: {token_response.text}")
        
        # Check for HTTP errors
        if not token_response.ok:
            logger.error(f"Token exchange HTTP error: {token_response.status_code} - {token_response.text}")
            frontend_url = f"http://localhost:3000/login?error=token_exchange_failed&status={token_response.status_code}"
            return HttpResponseRedirect(frontend_url)
        
        try:
            token_info = token_response.json()
        except Exception as e:
            logger.error(f"Failed to parse token response JSON: {e}")
            frontend_url = "http://localhost:3000/login?error=invalid_token_response"
            return HttpResponseRedirect(frontend_url)
        
        logger.info(f"Token info received: {token_info}")
        
        # Check for OAuth errors in the response
        if 'error' in token_info:
            error_type = token_info.get('error')
            error_description = token_info.get('error_description', '')
            logger.error(f"OAuth error: {error_type} - {error_description}")
            frontend_url = f"http://localhost:3000/login?error=oauth_error&type={error_type}"
            return HttpResponseRedirect(frontend_url)
        
        access_token = token_info.get('access_token')
        
        logger.info(f"Token exchange successful. Access token received: {bool(access_token)}")
        logger.info(f"Token info keys: {list(token_info.keys())}")
        
        if access_token:
            logger.info(f"Access token length: {len(access_token)}")
            token_preview = access_token[:20] + '...' if len(access_token) > 20 else access_token
            logger.info(f"Access token starts with: {token_preview}")
            logger.info(f"Token type in response: {token_info.get('token_type')}")
        
        if not access_token:
            logger.error(f"No access token in response: {token_info}")
            frontend_url = "http://localhost:3000/login?error=no_access_token"
            return HttpResponseRedirect(frontend_url)
        
        # Use the Google OAuth serializer to authenticate user
        try:
            import time
            request_id = f"oauth_{int(time.time() * 1000000) % 1000000}"
            logger.info(f"[{request_id}] Starting OAuth serializer process")
            logger.info(f"[{request_id}] Access token type: {type(access_token)}")
            logger.info(f"[{request_id}] Access token value: {access_token}")
            
            if isinstance(access_token, dict):
                logger.error(f"[{request_id}] ERROR: access_token is a dict! This should never happen!")
                logger.error(f"[{request_id}] Dict contents: {access_token}")
                frontend_url = "http://localhost:3000/login?error=access_token_is_dict"
                return HttpResponseRedirect(frontend_url)
            
            token_preview = access_token[:20] + '...' if access_token and isinstance(access_token, str) else str(access_token)
            logger.info(f"[{request_id}] Creating OAuth serializer with access_token: {token_preview}")
            
            serializer_data = {'access_token': access_token}
            logger.info(f"[{request_id}] Serializer data: {serializer_data}")
            serializer = GoogleOAuthSerializer(data=serializer_data)
            
            logger.info(f"Validating OAuth serializer...")
            if serializer.is_valid():
                logger.info("OAuth serializer validation successful")
                validated_data = serializer.validated_data
                tokens = validated_data['tokens']
                
                # Parse state to determine where to redirect after login
                redirect_after_login = '/dashboard'
                if state:
                    try:
                        import json
                        import urllib.parse
                        decoded_state = urllib.parse.unquote(state)
                        state_data = json.loads(decoded_state)
                        redirect_after_login = state_data.get('return_to', '/dashboard')
                    except Exception as e:
                        logger.error(f"Error parsing state: {e}")
                        pass
                
                # Always redirect to login page with tokens and redirect info
                redirect_param = f"&redirect={redirect_after_login}" if redirect_after_login != '/dashboard' else ''
                frontend_url = f"http://localhost:3000/login?oauth_success=true&access_token={tokens['access']}&refresh_token={tokens.get('refresh', '')}{redirect_param}"
                return HttpResponseRedirect(frontend_url)
            else:
                logger.error(f"OAuth serializer validation failed: {serializer.errors}")
                token_preview = access_token[:20] + '...' if access_token else 'No access token'
                logger.error(f"Access token received: {token_preview}")
                frontend_url = f"http://localhost:3000/login?error=authentication_failed&details={','.join([str(e) for e in serializer.errors.values()])}"
                return HttpResponseRedirect(frontend_url)
                
        except Exception as serializer_error:
            logger.error(f"Serializer creation/validation error: {serializer_error}")
            import traceback
            logger.error(f"Serializer traceback: {traceback.format_exc()}")
            error_msg_preview = str(serializer_error)[:100] if serializer_error else 'Unknown error'
            frontend_url = f"http://localhost:3000/login?error=serializer_error&msg={error_msg_preview}"
            return HttpResponseRedirect(frontend_url)
            
    except Exception as e:
        import traceback
        logger.error(f"OAuth callback error: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        
        # Include more specific error information
        error_type = type(e).__name__
        error_msg = str(e)
        
        error_msg_preview = error_msg[:100] if error_msg and len(error_msg) > 100 else str(error_msg) if error_msg else 'Unknown'
        frontend_url = f"http://localhost:3000/login?error=server_error&type={error_type}&msg={error_msg_preview}"
        return HttpResponseRedirect(frontend_url)


@api_view(['GET'])
@permission_classes([AllowAny]) 
def oauth_status(request):
    """
    Check OAuth availability and configuration status.
    
    Useful for frontend to check if OAuth is properly configured.
    """
    try:
        google_configured = bool(settings.GOOGLE_OAUTH2_CLIENT_ID and settings.GOOGLE_OAUTH2_CLIENT_SECRET)
        
        return Response({
            'oauth_enabled': True,
            'providers': {
                'google': {
                    'available': google_configured,
                    'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID[:10] + '...' if google_configured else None
                }
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error checking OAuth status: {str(e)}")
        return Response({
            'oauth_enabled': False,
            'error': 'Unable to check OAuth status'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def social_providers(request):
    """
    Compatibility endpoint for frontend expecting a providers list.
    Returns a minimal list with Google as supported provider.
    """
    providers = [
        {"id": "google", "name": "Continue with Google"},
    ]
    return Response(providers, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def social_google_login(request):
    """
    Start Google OAuth login by returning an authorization URL.

    Expected payload: { "redirect_uri": string, "state"?: string }
    Response: { "authorization_url": string, "state": string, "code_verifier"?: string }
    """
    try:
        client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', None)
        if not client_id:
            return Response({
                'error': 'Google OAuth not configured',
                'details': 'GOOGLE_OAUTH2_CLIENT_ID not set'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Use provided redirect_uri or fallback to server callback
        # Always use backend callback URL so it matches what is registered with Google
        redirect_uri = request.build_absolute_uri(reverse('google_oauth_callback'))

        # Optional state from client, otherwise generate a simple one
        import time
        state = request.data.get('state') if isinstance(request.data, dict) else None
        if not state:
            state = f'oauth_request_{int(time.time())}'

        params = {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': 'openid profile email',
            'access_type': 'online',
            'include_granted_scopes': 'true',
            'prompt': 'consent',
            'state': state,
        }
        base = 'https://accounts.google.com/o/oauth2/v2/auth'
        authorization_url = base + '?' + urllib.parse.urlencode(params)

        return Response({
            'authorization_url': authorization_url,
            'state': state,
            # PKCE not used currently; included for compatibility
            'code_verifier': None,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error creating social google login URL: {e}")
        return Response({'error': 'Unable to start social login'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def social_google_callback(request):
    """
    Complete Google OAuth by exchanging code for tokens and returning JWTs.

    Expected payload: { code: string, redirect_uri?: string, state?: string, code_verifier?: string }
    Response: { access: string, refresh: string, user: {...} }
    """
    try:
        # Extract payload
        if not isinstance(request.data, dict):
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)

        code = request.data.get('code')
        # Must match the redirect_uri used in the initial authorization request
        redirect_uri = request.build_absolute_uri(reverse('google_oauth_callback'))
        if not code:
            return Response({'error': 'Missing authorization code'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure credentials exist
        client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', None)
        client_secret = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_SECRET', None)
        if not client_id or not client_secret:
            return Response({'error': 'OAuth not configured'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Exchange code for access token
        import requests
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }
        token_response = requests.post(token_url, data=token_data)
        if not token_response.ok:
            return Response({'error': 'Token exchange failed', 'status': token_response.status_code}, status=status.HTTP_400_BAD_REQUEST)

        token_info = token_response.json()
        access_token = token_info.get('access_token')
        if not access_token:
            return Response({'error': 'No access token in response'}, status=status.HTTP_400_BAD_REQUEST)

        # Use existing serializer flow to issue our JWTs
        serializer = GoogleOAuthSerializer(data={'access_token': access_token})
        if not serializer.is_valid():
            return Response({'error': 'Authentication failed', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data
        user = validated['user']
        tokens = validated['tokens']
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': UserSerializer(user).data,
            'message': 'Google OAuth login successful!'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error completing social google login: {e}")
        return Response({'error': 'Unable to complete social login'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# And that's our OAuth views! Simple, clean, and ready to handle Google authentication.
# The frontend can now easily authenticate users with Google! 🎯
