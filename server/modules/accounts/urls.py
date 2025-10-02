# Welcome to the URL configuration for our 'accounts' module!
# This is the roadmap for all the authentication-related endpoints in our app.
# Let's see where each path takes us! 🗺️

from django.urls import path, include
from .views import RegisterView, LogoutView, MyTokenObtainPairView, ProfileView
from .oauth_views import (
    google_oauth_login, google_oauth_config, google_oauth_callback, 
    oauth_status, social_providers, social_google_login, social_google_callback
)
from rest_framework_simplejwt.views import TokenRefreshView

# Here's our list of URL patterns for the 'accounts' module.
# Each one is a different stop on our authentication journey.
urlpatterns = [
    # The 'register' endpoint. This is where new users sign up.
    # It's connected to our `RegisterView`, which handles the registration logic.
    path('register/', RegisterView.as_view(), name='register'),

    # The 'login' endpoint. This is where users get their golden ticket (JWT).
    # It's connected to our custom `MyTokenObtainPairView`, which handles the login logic.
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # The 'token/refresh' endpoint. This is where users can get a new access token.
    # It's like getting a new key when the old one is about to expire.
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # The 'logout' endpoint. This is where users say goodbye (for now).
    # It's connected to our `LogoutView`, which handles the logout logic.
    path('logout/', LogoutView.as_view(), name='logout'),

    # The 'profile' endpoint. This is where users can view and update their profile.
    # It's connected to our `ProfileView`, which handles all the profile-related logic.
    path('profile/', ProfileView.as_view(), name='profile'),

    # The 'password-reset' endpoint. For when users forget their secret code.
    # We're including the URLs from the `django-rest-passwordreset` library to handle this.
    path('password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    # --- Google OAuth Authentication Endpoints ---
    
    # OAuth configuration endpoint - provides frontend with necessary OAuth config
    path('oauth/config/', google_oauth_config, name='google_oauth_config'),
    
    # OAuth status endpoint - checks if OAuth is properly configured
    path('oauth/status/', oauth_status, name='oauth_status'),
    
    # Main OAuth login endpoint - handles Google access token authentication
    path('oauth/google/', google_oauth_login, name='google_oauth_login'),
    
    # OAuth callback endpoint - handles Google's authorization code callback
    path('oauth/google/callback/', google_oauth_callback, name='google_oauth_callback'),

    # --- Social Authentication API (Alternative endpoints for frontend compatibility) ---
    
    # Social providers list endpoint
    path('social/providers/', social_providers, name='social_providers'),
    
    # Social login initiation endpoint
    path('social/google/login/', social_google_login, name='social_google_login'),
    
    # Social login completion endpoint
    path('social/google/callback/', social_google_callback, name='social_google_callback'),
]

# And that's a wrap on our 'accounts' URLs! They're all set to guide our users
# through the authentication process. Now, let's move on to the next module! 🚀
