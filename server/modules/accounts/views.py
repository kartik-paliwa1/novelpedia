# Lights, camera, action! Welcome to the views file for our 'accounts' module.
# This is where we define the logic for our API endpoints. It's the director's chair of our app! 🎬

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout as django_logout
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated

# --- The Register View: The grand entrance! ---
# This view handles new user registrations. It's the red carpet for our new users.
class RegisterView(generics.CreateAPIView):
    # We're using the `RegisterSerializer` to handle the registration process.
    serializer_class = RegisterSerializer
    # No permissions needed to register, of course!
    permission_classes = [permissions.AllowAny]

# --- The Login View: The key master! ---
# This view handles user logins. It's the gatekeeper of our app.
class LoginView(APIView):
    # No permissions needed to log in either.
    permission_classes = [permissions.AllowAny]

    # We're handling POST requests to this endpoint.
    def post(self, request):
        # We're using the `LoginSerializer` to validate the user's credentials.
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # If the credentials are valid, we get the user object.
        user = serializer.validated_data
        # We're generating a refresh token for the user.
        refresh = RefreshToken.for_user(user)
        # And we're sending back the refresh token, an access token, and the user's data.
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        })

# --- The Logout View: The grand exit! ---
# This view handles user logouts. It's the "see you later" of our app.
class LogoutView(APIView):
    # Only authenticated users can log out. Makes sense, right?
    permission_classes = [permissions.IsAuthenticated]

    # We're handling POST requests to this endpoint.
    def post(self, request):
        # We're deleting the user's auth token to log them out.
        try:
            request.user.auth_token.delete()
        except (AttributeError, Token.DoesNotExist):
            pass
        # We're also logging them out of the Django session, just in case.
        django_logout(request)
        # And we're sending back a success message.
        return Response({"detail": "Successfully logged out. Come back soon!"}, status=status.HTTP_200_OK)
    
# --- The Token Obtain Pair View: The token factory! ---
# This view is used to get a new access token using a refresh token.
class MyTokenObtainPairView(TokenObtainPairView):
    # We're using our custom `MyTokenObtainPairSerializer` to handle the token generation.
    serializer_class = MyTokenObtainPairSerializer

# --- The Profile View: The user's personal space! ---
# This view handles all things related to the user's profile.
class ProfileView(APIView):
    # Only authenticated users can access their profile.
    permission_classes = [IsAuthenticated]

    # This method handles GET requests to the endpoint. It's for viewing the profile.
    def get(self, request):
        # We're using the `UserSerializer` to serialize the user's data.
        serializer = UserSerializer(request.user)
        # And we're sending back the user's data.
        return Response(serializer.data)
    
    # This method handles PUT requests. It's for updating the entire profile.
    def put(self, request):
        # We're using the `UserSerializer` to update the user's data.
        serializer = UserSerializer(request.user, data=request.data)
        # If the data is valid, we save it and send back the updated data.
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # If the data is not valid, we send back an error message.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # This method handles PATCH requests. It's for partially updating the profile.
    def patch(self, request):     
        # We're using the `UserSerializer` with `partial=True` to update only the provided fields.
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        # If the data is valid, we save it and send back the updated data.
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # If the data is not valid, we send back an error message.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# And that's a wrap on our views! They're all set to handle requests and make our app come to life.
# Now, let's connect them to our URLs and we'll have a fully functional authentication system! 🚀
