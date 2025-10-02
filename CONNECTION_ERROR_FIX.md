# Google OAuth Connection Error Fix Guide

## The Problem
You're seeing this error in the browser console:
```
:8000/api/accounts/social/providers/:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

This means your frontend (Next.js) can't connect to your backend (Django) server.

## Solution Steps

### Step 1: Start Django Server Properly

1. **Kill any existing Django processes:**
   ```powershell
   Get-Process python | Stop-Process -Force
   ```

2. **Navigate to your project directory:**
   ```powershell
   cd "C:\Users\Soyam\Downloads\Mvp-hopefully-codex-document-working-features-in-features.md"
   ```

3. **Activate virtual environment:**
   ```powershell
   .venv\Scripts\Activate.ps1
   ```

4. **Start Django server:**
   ```powershell
   cd server
   python manage.py runserver 0.0.0.0:8000
   ```

   **Important:** Use `0.0.0.0:8000` instead of `localhost:8000` to allow external connections.

### Step 2: Verify Server is Running

1. **Check if port 8000 is in use:**
   ```powershell
   netstat -an | findstr :8000
   ```
   You should see something like:
   ```
   TCP    0.0.0.0:8000          0.0.0.0:0              LISTENING
   ```

2. **Test endpoint manually:**
   Open your browser and go to: http://localhost:8000/api/accounts/social/providers/
   
   You should see a JSON response like:
   ```json
   [{"id": "google", "name": "Continue with Google"}]
   ```

### Step 3: Verify Frontend Configuration

1. **Check your .env file** in the root directory contains:
   ```
   NEXT_PUBLIC_API_URL="http://localhost:8000/api"
   ```

2. **Restart your Next.js server** to pick up environment changes:
   ```powershell
   # Kill npm process
   Get-Process node | Stop-Process -Force
   
   # Start fresh
   npm run dev
   ```

### Step 4: Test Google OAuth

Once both servers are running:

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. It should redirect you to Google OAuth (if credentials are configured)

## Alternative Quick Fix

If you're still having issues, try this batch file I created for you:

1. **Run the Django server using the batch file:**
   ```
   start_django.bat
   ```

## Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:** Make sure virtual environment is activated
```powershell
.venv\Scripts\Activate.ps1
```

### Issue 2: CORS errors in browser
**Solution:** The CORS settings are already configured correctly in your Django settings.

### Issue 3: Django server not accessible
**Solution:** Use `0.0.0.0:8000` instead of `localhost:8000` or `127.0.0.1:8000`

### Issue 4: Google OAuth credentials not working
**Solution:** Update `server/.env` with your real Google OAuth credentials from Google Cloud Console.

## Verify Everything is Working

1. **Django server:** http://localhost:8000/api/accounts/social/providers/
2. **Next.js frontend:** http://localhost:3000/login
3. **OAuth flow:** Click "Continue with Google" should work

## Google OAuth Credentials Setup

If you haven't set up Google OAuth credentials yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:8000/api/accounts/oauth/google/callback/`
4. Update `server/.env` with your real Client ID and Secret

Your Google OAuth implementation is complete - you just need to get the servers running properly! 🚀