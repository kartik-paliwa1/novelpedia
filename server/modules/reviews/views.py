# Welcome to the views file for our 'reviews' module!
# This is where we define the API endpoints for our reviews. It's where the magic happens! ✨

from rest_framework import viewsets, permissions, filters
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsReviewAuthorOrNovelAuthorOrReadOnly

# --- The Review ViewSet: The all-in-one review machine! ---
# This viewset handles all the CRUD operations for reviews. It's the Swiss Army knife of our review module.
class ReviewViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing reviews. Here's what you can do:
    - Anyone can list and retrieve reviews.
    - Authenticated users can create, update, and delete their own reviews.
    - You can filter reviews by novel ID using a query parameter, like this: `?novel=<id>`
    """
    # We're getting all the reviews from the database and ordering them by creation date.
    queryset = Review.objects.all().order_by('-created_at')
    # We're using the `ReviewSerializer` to serialize our reviews.
    serializer_class = ReviewSerializer
    # We're adding some filtering, ordering, and searching capabilities to our viewset.
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['created_at', 'rating']
    search_fields = ['comment', 'user__username', 'novel__title']

    # We're setting the permissions for this viewset.
    def get_permissions(self):
        # Anyone can list, retrieve, and create reviews.
        if self.action in ['list', 'retrieve', 'create']:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        # But only the author of the review or the author of the novel can update or delete it.
        else:
            permission_classes = [IsReviewAuthorOrNovelAuthorOrReadOnly]
        return [permission() for permission in permission_classes]

    # We're overriding the `get_queryset` method to allow filtering by novel ID.
    def get_queryset(self):
        queryset = super().get_queryset()
        novel_id = self.request.query_params.get('novel')
        # If a novel ID is provided in the query parameters, we're filtering the reviews by that novel.
        if novel_id:
            queryset = queryset.filter(novel_id=novel_id)
        return queryset

    # We're overriding the `perform_create` method to automatically set the user of the review.
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# And that's our review viewset! It's all set to handle requests and make our app's review system a breeze.
# Now, let's connect it to our URLs and we'll be ready to rock! 🎸
