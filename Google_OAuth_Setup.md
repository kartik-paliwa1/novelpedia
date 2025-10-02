# Google OAuth Setup Guide

## Implementation Status ✅
The Google OAuth authentication system has been fully implemented in your Django + Next.js application. Here's what was added:

### Backend (Django) - COMPLETED ✅
- **OAuth Serializers**: `server/modules/accounts/oauth_serializers.py`
  - Handles Google token validation and user authentication
  - Creates new users or authenticates existing ones
  - Returns JWT tokens for frontend authentication

- **OAuth Views**: `server/modules/accounts/oauth_views.py`
  - `/api/auth/oauth/google/` - Main authentication endpoint
  - `/api/auth/oauth/config/` - OAuth configuration endpoint
  - `/api/auth/oauth/status/` - Authentication status check

- **Django Settings**: Updated `server/core/settings.py`
  - Added `django-allauth` and required apps
  - Configured Google OAuth provider settings
  - Added necessary middleware

### Frontend (Next.js) - COMPLETED ✅
- **Login Page**: Updated `Novel's Page/src/app/auth/login/page.tsx`
  - Added "Continue with Google" button
  - Implements OAuth flow initiation

- **OAuth Callback**: Created `Novel's Page/src/app/auth/oauth/callback/page.tsx`
  - Handles Google OAuth callback
  - Exchanges authorization code for JWT tokens
  - Redirects to dashboard on success

- **API Service**: Enhanced with Google OAuth methods
  - `googleOAuthConfig()` - Gets OAuth configuration
  - `googleOAuth(code, state)` - Authenticates with Google code

## Required Setup Steps

### 1. Google Cloud Console Setup
You need to create OAuth credentials in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - Development: `http://127.0.0.1:8000/api/accounts/oauth/google/callback/`
   - Alternative development: `http://localhost:8000/api/accounts/oauth/google/callback/`
   - Production: `https://yourdomain.com/api/accounts/oauth/google/callback/`
7. Copy the Client ID and Client Secret

### 2. Environment Variables
Add these to your environment files:

**Backend (.env or environment):**
```
GOOGLE_OAUTH2_CLIENT_ID=your_google_client_id_here
GOOGLE_OAUTH2_CLIENT_SECRET=your_google_client_secret_here
```

**Frontend (if needed):**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Database Migration
Run the database migration (already done):
```bash
cd server
python manage.py migrate
```

### 4. Install Dependencies
Required packages are already installed:
- `django-allauth`
- `python-decouple`
- `cryptography`

## Testing the OAuth Flow

1. **Start the Django server:**
   ```bash
   cd server
   python manage.py runserver
   ```

2. **Start the Next.js frontend:**
   ```bash
   cd "Novel's Page"
   npm run dev
   ```

3. **Test the flow:**
   - Go to the login page
   - Click "Continue with Google"
   - Complete Google authentication
   - Should redirect back to your app and authenticate

## Authentication Flow Diagram

```
User clicks "Continue with Google"
         ↓
Frontend gets OAuth config from backend
         ↓
Redirect to Google OAuth
         ↓
User authenticates with Google
         ↓
Google redirects to /auth/oauth/callback
         ↓
Frontend exchanges code for tokens
         ↓
Backend validates Google token and returns JWT
         ↓
Frontend stores JWT and redirects to dashboard
```

## API Endpoints

- `GET /api/auth/oauth/config/` - Get OAuth configuration
- `POST /api/auth/oauth/google/` - Authenticate with Google code
- `GET /api/auth/oauth/status/` - Check authentication status

## Security Considerations

1. **HTTPS in Production**: Ensure OAuth redirects use HTTPS
2. **Client Secret Security**: Keep client secrets secure and never expose in frontend
3. **CORS Configuration**: Configure CORS for your domain
4. **JWT Security**: Use secure JWT signing keys

## Troubleshooting

### Common Issues:
1. **"redirect_uri_mismatch"**: Check Google Cloud Console redirect URIs
2. **CORS errors**: Verify CORS settings in Django
3. **Token validation errors**: Check Google client credentials
4. **Database errors**: Ensure migrations are run

### Debug Mode:
Enable Django debug mode and check server logs for detailed error messages.

## Next Steps
1. Set up Google Cloud Console credentials
2. Update environment variables
3. Test the authentication flow
4. Configure production settings