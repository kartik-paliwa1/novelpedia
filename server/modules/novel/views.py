# Welcome to the views file for our 'novel' module! This is where the real action happens.
# We're defining all the API endpoints for creating, reading, updating, and deleting novels.
# So grab your popcorn, because it's showtime! 🍿

import cloudinary.uploader
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics, exceptions
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, Avg, Q
from django.db.models.functions import Floor
import traceback
import logging
from rest_framework import viewsets
from modules.chapters.models import Chapter
from modules.reviews.models import Review
from modules.comments.models import Comment

from .models import Novel, FeaturedNovel, Bookmark
from .serializers import (
    NovelSerializer,
    FeaturedNovelSerializer,
    NovelWriteSerializer,
    BookmarkSerializer,
    NovelListSerializer,
)
from .filters import NovelFilter

logger = logging.getLogger(__name__)

# --- The Novel Image Upload View: A picture is worth a thousand words! ---
# This view is for uploading cover images for our novels.
class NovelImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        novel_id = request.data.get('novel_id')
        if not novel_id:
            return Response({'detail': 'Novel ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        novel = get_object_or_404(Novel, id=novel_id)
        # We're making sure that only the author or an admin can upload an image.
        if novel.author != request.user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to upload images to this novel.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = NovelSerializer(novel, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- My Novels List View: A list of all your creations! ---
# This view is for listing all the novels created by the logged-in user.
class MyNovelsListView(generics.ListAPIView):
    serializer_class = NovelSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = NovelFilter

    def get_queryset(self):
        return (
            Novel.objects.filter(author=self.request.user)
            .select_related('primary_genre', 'author')
            .prefetch_related('tags', 'genres')
            .order_by('-created_at')
        )
    
# --- The Featured Novel ViewSet: The best of the best! ---
# This viewset is for managing featured novels. It's for showcasing the cream of the crop.
class FeaturedNovelViewSet(viewsets.ModelViewSet):
    queryset = FeaturedNovel.objects.all().select_related('novel')
    serializer_class = FeaturedNovelSerializer

    def get_permissions(self):
        # Anyone can view the featured novels, but only admins can manage them.
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # We're only showing active featured novels to the public.
        if self.action == 'list':
            return FeaturedNovel.objects.filter(is_active=True).select_related('novel')
        return super().get_queryset()
    
# --- The Author Novels List View: See what your favorite author is up to! ---
# This view is for listing all the novels by a specific author.
class AuthorNovelsListView(generics.ListAPIView):
    serializer_class = NovelSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        author_id = self.kwargs.get('author_id')
        return (
            Novel.objects.filter(author_id=author_id)
            .select_related('primary_genre', 'author')
            .prefetch_related('tags', 'genres')
            .order_by('-created_at')
        )
    
# --- The Bookmark ViewSet: Save it for later! ---
# This viewset is for managing bookmarks.
class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # We're only showing the bookmarks of the logged-in user.
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- The Novel ViewSets: Dedicated flows for readers and authors! ---
class NovelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Novel.objects.all()
        .select_related('author', 'primary_genre')
        .prefetch_related('tags', 'genres')
        .order_by('-created_at')
    )
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return NovelListSerializer
        return NovelSerializer


class AuthorNovelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        base_queryset = (
            Novel.objects.all()
            .select_related('author', 'primary_genre')
            .prefetch_related('tags', 'genres')
            .order_by('-created_at')
        )
        user = self.request.user
        if getattr(user, 'is_staff', False) or getattr(user, 'role', '') == 'admin':
            return base_queryset
        return base_queryset.filter(author=user)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return NovelSerializer
        return NovelWriteSerializer

    def perform_create(self, serializer):
        user = self.request.user
        is_admin_or_staff = (
            getattr(user, 'role', '') == 'admin'
            or getattr(user, 'user_status', '') == 'admin'
            or getattr(user, 'is_staff', False)
        )
        if not is_admin_or_staff and getattr(user, 'role', '') != 'author':
            user.role = 'author'
            user.save(update_fields=['role'])
        serializer.save()

    def perform_update(self, serializer):
        novel = self.get_object()
        user = self.request.user
        if novel.author != user and not getattr(user, 'is_staff', False) and getattr(user, 'role', '') != 'admin':
            raise exceptions.PermissionDenied("Hold on there! You can't edit someone else's novel.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if instance.author != user and not getattr(user, 'is_staff', False) and getattr(user, 'role', '') != 'admin':
            raise exceptions.PermissionDenied("Whoa there! You can't delete a novel that's not yours.")
        instance.delete()

# --- The Trending Novels View: What's hot right now! ---
# This view returns novels sorted by their popularity (views + likes)
class TrendingNovelsView(generics.ListAPIView):
    serializer_class = NovelSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Return novels ordered by popularity (views and likes combined)
        return (
            Novel.objects.all()
            .select_related('primary_genre', 'author')
            .prefetch_related('tags', 'genres')
            .order_by('-views', '-likes', '-rating')[:20]
        )  # Top 20 trending novels

# --- The Latest Novels View: Fresh off the press! ---
# This view returns the most recently created novels
class LatestNovelsView(generics.ListAPIView):
    serializer_class = NovelSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Return novels ordered by creation date (newest first)
        return (
            Novel.objects.all()
            .select_related('primary_genre', 'author')
            .prefetch_related('tags', 'genres')
            .order_by('-created_at')[:20]
        )  # Latest 20 novels


def _calculate_percentage_change(current_value: float, previous_value: float) -> float:
    """Utility helper to compute safe percentage changes."""
    if previous_value == 0:
        return 100.0 if current_value > 0 else 0.0
    return ((current_value - previous_value) / previous_value) * 100.0


class AuthorDashboardStatsView(APIView):
    """Aggregated metrics for an author's dashboard performance view."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        novels = Novel.objects.filter(author=user)
        chapters = Chapter.objects.filter(novel__author=user)
        reviews = Review.objects.filter(novel__author=user)
        comments = Comment.objects.filter(
            Q(chapter__novel__author=user) | Q(paragraph__chapter__novel__author=user)
        )

        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        total_views = novels.aggregate(total=Sum('views'))['total'] or 0
        recent_views = novels.filter(last_updated__gte=thirty_days_ago).aggregate(total=Sum('views'))['total'] or 0
        previous_views = (
            novels.filter(last_updated__gte=sixty_days_ago, last_updated__lt=thirty_days_ago)
            .aggregate(total=Sum('views'))
            .get('total')
            or 0
        )

        total_comments = comments.count()
        total_reviews = reviews.count()
        recent_engagement = (
            reviews.filter(created_at__gte=thirty_days_ago).count()
            + comments.filter(created_at__gte=thirty_days_ago).count()
        )
        previous_engagement = (
            reviews.filter(created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago).count()
            + comments.filter(created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago).count()
        )

        total_chapters = chapters.count()
        published_chapters = chapters.filter(status='published').count()
        recent_published = chapters.filter(status='published', updated_at__gte=thirty_days_ago).count()
        previous_published = chapters.filter(
            status='published', updated_at__gte=sixty_days_ago, updated_at__lt=thirty_days_ago
        ).count()

        engagement_events = total_reviews + total_comments
        engagement_rate = (engagement_events / total_views * 100.0) if total_views else 0.0

        estimated_revenue = total_views * 0.0025
        recent_revenue = recent_views * 0.0025
        previous_revenue = previous_views * 0.0025

        average_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or 0.0
        rating_distribution = {str(star): 0 for star in range(1, 6)}
        for entry in reviews.annotate(star_bucket=Floor('rating')).values('star_bucket').annotate(count=Count('id')):
            star_value = int(entry['star_bucket'] or 0)
            star_value = min(max(star_value, 1), 5)
            rating_distribution[str(star_value)] += entry['count']

        data = {
            'performance': {
                'totalViews': {
                    'value': total_views,
                    'change': round(_calculate_percentage_change(recent_views, previous_views), 1),
                    'description': 'Last 30 days',
                },
                'engagementRate': {
                    'value': round(engagement_rate, 1),
                    'change': round(_calculate_percentage_change(recent_engagement, previous_engagement), 1),
                    'description': 'Comments and reviews per view',
                },
                'chapterCompletion': {
                    'value': round((published_chapters / total_chapters * 100.0), 1) if total_chapters else 0.0,
                    'change': round(_calculate_percentage_change(recent_published, previous_published), 1),
                    'description': 'Published chapters vs total',
                },
                'estimatedRevenue': {
                    'value': round(estimated_revenue, 2),
                    'change': round(_calculate_percentage_change(recent_revenue, previous_revenue), 1),
                    'description': 'Based on $0.0025 per view',
                },
            },
            'ratings': {
                'averageRating': float(average_rating),
                'totalReviews': total_reviews,
                'distribution': rating_distribution,
            },
        }

        return Response(data)

# And that's a wrap on our novel views! They're all set to handle requests and make our app a novel-lover's paradise.
# Now, let's connect them to our URLs and we'll be ready to rock! 🎸
