from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json
import os
from django.utils.crypto import get_random_string
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from .models import MyUser
from .serializers import UserSerializer


def _google_config():
    # Prefer Django settings if present; fall back to envs
    client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None) or os.getenv('GOOGLE_CLIENT_ID')
    client_secret = getattr(settings, 'GOOGLE_CLIENT_SECRET', None) or os.getenv('GOOGLE_CLIENT_SECRET')
    default_redirect = getattr(settings, 'GOOGLE_REDIRECT_URI', None) or os.getenv('GOOGLE_REDIRECT_URI')
    return client_id, client_secret, default_redirect


class SocialProvidersView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        client_id, _, _ = _google_config()
        providers = [
            {
                'id': 'google',
                'name': 'Google',
                # Expose whether it’s configured so UI can react
                'configured': bool(client_id),
            }
        ]
        return Response(providers, status=status.HTTP_200_OK)


class SocialLoginStartView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider: str):
        provider = (provider or '').lower()
        if provider != 'google':
            return Response({'detail': 'Unsupported provider'}, status=status.HTTP_400_BAD_REQUEST)

        client_id, _, default_redirect = _google_config()
        if not client_id:
            return Response(
                {'detail': 'Google OAuth not configured on server'},
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )

        redirect_uri = request.data.get('redirect_uri') or default_redirect
        if not redirect_uri:
            return Response({'detail': 'redirect_uri required'}, status=status.HTTP_400_BAD_REQUEST)

        state = get_random_string(24)

        params = {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': 'openid email profile',
            'access_type': 'offline',
            'include_granted_scopes': 'true',
            'prompt': 'consent',
            'state': state,
        }
        authorization_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"

        return Response(
            {'authorization_url': authorization_url, 'state': state},
            status=status.HTTP_200_OK,
        )


class SocialCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider: str):
        provider = (provider or '').lower()
        if provider != 'google':
            return Response({'detail': 'Unsupported provider'}, status=status.HTTP_400_BAD_REQUEST)

        code = request.data.get('code')
        redirect_uri = request.data.get('redirect_uri')
        if not code:
            return Response({'detail': 'Missing code'}, status=status.HTTP_400_BAD_REQUEST)

        client_id, client_secret, default_redirect = _google_config()
        if not client_id or not client_secret:
            return Response(
                {'detail': 'Google OAuth not configured on server'},
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )

        if not redirect_uri:
            redirect_uri = default_redirect
        if not redirect_uri:
            return Response({'detail': 'redirect_uri required'}, status=status.HTTP_400_BAD_REQUEST)

        # Exchange code for tokens
        token_endpoint = 'https://oauth2.googleapis.com/token'
        token_payload = urlencode(
            {
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code',
            }
        ).encode('utf-8')

        try:
            req = Request(token_endpoint, data=token_payload, headers={'Content-Type': 'application/x-www-form-urlencoded'})
            with urlopen(req, timeout=10) as resp:
                token_data = json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            return Response({'detail': f'Failed to exchange code: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_data.get('access_token')
        if not access_token:
            return Response({'detail': 'Missing access_token from Google'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch basic user info
        try:
            userinfo_req = Request(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'},
            )
            with urlopen(userinfo_req, timeout=10) as resp:
                userinfo = json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            return Response({'detail': f'Failed to fetch user info: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        email = userinfo.get('email')
        name = userinfo.get('name') or (userinfo.get('given_name') or 'user')

        if not email:
            return Response({'detail': 'Email not available from Google account'}, status=status.HTTP_400_BAD_REQUEST)

        # Try to find existing user by email
        try:
            user = MyUser.objects.get(email=email)
        except MyUser.DoesNotExist:
            # Our model requires dob and gender; if creating, fill sane defaults
            base_name = (name or email).split('@')[0]
            candidate = base_name
            suffix = 0
            while MyUser.objects.filter(name=candidate).exists():
                suffix += 1
                candidate = f"{base_name}{suffix}"
            try:
                user = MyUser.objects.create_user(
                    name=candidate,
                    email=email,
                    dob='1970-01-01',
                    gender='O',
                    password=None,
                )
            except Exception as e:
                return Response({'detail': f'Failed to create user: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }
        return Response(data, status=status.HTTP_200_OK)
