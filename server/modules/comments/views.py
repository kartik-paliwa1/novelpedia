# Welcome to the views file for our 'comments' module!
# This is where we define the API endpoints for our comments. It's where the magic happens! ✨

from rest_framework import viewsets, permissions
from .models import Comment
from .serializers import CommentSerializer

# --- The Comment ViewSet: The all-in-one comment machine! ---
# This viewset handles all the CRUD operations for comments. It's the Swiss Army knife of our comment module.
class CommentViewSet(viewsets.ModelViewSet):
    # We're getting all the comments from the database and ordering them by creation date.
    queryset = Comment.objects.all().order_by('created_at')
    # We're using the `CommentSerializer` to serialize our comments.
    serializer_class = CommentSerializer

    # We're setting the permissions for this viewset.
    def get_permissions(self):
        # Anyone can view the comments.
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        # But only authenticated users can create, update, or delete them.
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    # We're overriding the `perform_create` method to automatically set the user of the comment.
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# And that's our comment viewset! It's all set to handle requests and make our app's comment system a breeze.
# Now, let's connect it to our URLs and we'll be ready to rock! 🎸
