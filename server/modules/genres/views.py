# Welcome to the views file for our 'genres' module!
# This is where we define the API endpoints for our genres. It's where the magic happens! ✨

from rest_framework import viewsets, permissions
from .models import Genre
from .serializers import GenreSerializer

# --- The Genre ViewSet: The all-in-one genre machine! ---
# This viewset handles all the CRUD operations for genres. It's the Swiss Army knife of our genre module.
class GenreViewSet(viewsets.ModelViewSet):
    # We're getting all the genres from the database.
    queryset = Genre.objects.all()
    # We're using the `GenreSerializer` to serialize our genres.
    serializer_class = GenreSerializer

    # We're setting the permissions for this viewset.
    def get_permissions(self):
        # Anyone can view the genres.
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        # But only authenticated users can create, update, or delete them.
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

# And that's our genre viewset! It's all set to handle requests and make our app's genre system a breeze.
# Now, let's connect it to our URLs and we'll be ready to rock! 🎸
