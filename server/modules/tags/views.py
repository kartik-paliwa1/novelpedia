# Welcome to the views file for our 'tags' module!
# This is where we define the API endpoints for our tags. It's where the magic happens! ✨

from rest_framework import viewsets, permissions
from .models import Tag
from .serializers import TagSerializer

# --- The Tag ViewSet: The all-in-one tag machine! ---
# This viewset handles all the CRUD operations for tags. It's the Swiss Army knife of our tag module.
class TagViewSet(viewsets.ModelViewSet):
    # We're getting all the tags from the database.
    queryset = Tag.objects.all()
    # We're using the `TagSerializer` to serialize our tags.
    serializer_class = TagSerializer

    # We're setting the permissions for this viewset.
    def get_permissions(self):
        # Anyone can view the tags.
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        # But only authenticated users can create, update, or delete them.
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

# And that's our tag viewset! It's all set to handle requests and make our app's tagging system a breeze.
# Now, let's connect it to our URLs and we'll be ready to rock! 🎸
