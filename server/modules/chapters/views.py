# Welcome to the views file for our 'chapters' module! This is where the story comes to life.
# We're defining all the API endpoints for creating, reading, updating, and deleting chapters and paragraphs.
# So let's get this show on the road! 🎬

import base64
import imghdr
import re
from uuid import uuid4

from rest_framework import viewsets, permissions, exceptions, mixins, views
from django.db import models
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from django.utils import timezone

from .models import Chapter, Paragraph
from modules.novel.models import Novel
from .filters import ChapterFilter
from .serializers import ChapterSerializer, ChapterCreateUpdateSerializer, ParagraphSerializer, ParagraphCreateSerializer

# --- The Chapter Stats View: Let's see the numbers! ---
# This view is for getting the stats of a chapter, like word count and total views.
class ChapterStatsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        chapter_id = self.kwargs.get('pk')
        chapter = get_object_or_404(Chapter, pk=chapter_id)
        stats = {'word_count': chapter.word_count, 'total_views': chapter.total_views}
        return Response(stats)

# --- The Chapter Autosave View: Don't lose your work! ---
# This view is for autosaving a chapter while the author is writing.
class ChapterAutosaveView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        chapter_id = self.kwargs.get('pk')
        chapter = get_object_or_404(Chapter, pk=chapter_id)
        # We're making sure that only the author or an admin can autosave the chapter.
        if chapter.novel.author != request.user and not request.user.is_staff:
            raise exceptions.PermissionDenied("Sorry, you can't autosave this chapter. It's not yours!")
        data = request.data

        ten_mb = 10 * 1024 * 1024
        update_fields: list[str] = []

        def compute_word_count(html: str | None) -> int:
            if not html:
                return 0
            text = re.sub(r'<[^>]+>', ' ', html)
            text = re.sub(r'\s+', ' ', text).strip()
            if not text:
                return 0
            return len(text.split(' '))

        def save_hero_image(image_data: str | None) -> str | None:
            nonlocal update_fields
            if image_data is None:
                return None

            if image_data == '':
                if chapter.hero_image:
                    chapter.hero_image.delete(save=False)
                    chapter.hero_image = None
                    update_fields.append('hero_image')
                return None

            if not image_data.startswith('data:image'):
                raise exceptions.ValidationError({'hero_image_data': 'Invalid image payload provided.'})

            header, _, base64_payload = image_data.partition(',')
            if not base64_payload:
                raise exceptions.ValidationError({'hero_image_data': 'Malformed base64 image data.'})

            try:
                decoded = base64.b64decode(base64_payload, validate=True)
            except Exception as exc:  # noqa: BLE001
                raise exceptions.ValidationError({'hero_image_data': 'Image payload could not be decoded.'}) from exc

            if len(decoded) > ten_mb:
                raise exceptions.ValidationError({'hero_image_data': 'Images must be 10MB or smaller.'})

            image_type = imghdr.what(None, decoded)
            if not image_type:
                raise exceptions.ValidationError({'hero_image_data': 'Uploaded image format is not supported.'})

            filename = f"chapter_{chapter.pk}_{uuid4().hex}.{image_type.lower()}"

            if chapter.hero_image:
                chapter.hero_image.delete(save=False)

            chapter.hero_image.save(filename, ContentFile(decoded), save=False)
            update_fields.append('hero_image')
            return chapter.hero_image.url if chapter.hero_image else None

        new_hero_image_url: str | None = None

        # We're updating the title if it's provided.
        if 'title' in data:
            chapter.title = data['title']
            update_fields.append('title')

        # Preserve formatted content when provided.
        if 'content_html' in data:
            chapter.content_html = data.get('content_html') or ''
            update_fields.append('content_html')

        if 'content_delta' in data:
            chapter.content_delta = data.get('content_delta')
            update_fields.append('content_delta')

        if 'hero_image_data' in data:
            try:
                new_hero_image_url = save_hero_image(data.get('hero_image_data'))
            except exceptions.ValidationError as error:
                return Response(error.detail, status=status.HTTP_400_BAD_REQUEST)

        total_words_from_paragraphs = None

        # We're replacing the paragraphs if they're provided.
        if 'paragraphs' in data and isinstance(data['paragraphs'], list):
            chapter.paragraphs.all().delete()
            new_paragraphs = [Paragraph(chapter=chapter, text=p_text, order=i, uid=str(uuid4())) for i, p_text in enumerate(data['paragraphs'])]
            Paragraph.objects.bulk_create(new_paragraphs)
            total_words_from_paragraphs = sum(len((p_text or '').split()) for p_text in data['paragraphs'])

        if new_hero_image_url and chapter.content_html:
            chapter.content_html = chapter.content_html.replace(data.get('hero_image_data'), new_hero_image_url)
            update_fields.append('content_html')

        if total_words_from_paragraphs is not None:
            chapter.word_count = total_words_from_paragraphs
            update_fields.append('word_count')
        elif 'content_html' in data:
            chapter.word_count = compute_word_count(chapter.content_html)
            update_fields.append('word_count')

        if update_fields:
            chapter.save(update_fields=list(dict.fromkeys(update_fields)))

        response_payload = {'status': 'autosaved'}
        if 'content_html' in data or new_hero_image_url:
            response_payload['content_html'] = chapter.content_html
        if 'content_delta' in data:
            response_payload['content_delta'] = chapter.content_delta
        if chapter.hero_image:
            image_url = chapter.hero_image.url
            if hasattr(request, 'build_absolute_uri'):
                image_url = request.build_absolute_uri(image_url)
            response_payload['hero_image_url'] = image_url

        return Response(response_payload, status=status.HTTP_200_OK)

# --- The Novel Chapter ViewSet: All the chapters of a novel in one place! ---
# This viewset is for listing and creating chapters for a specific novel.
class NovelChapterViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_class = ChapterFilter

    def get_serializer_class(self):
        return ChapterCreateUpdateSerializer if self.action == 'create' else ChapterSerializer

    def get_queryset(self):
        novel_slug = self.kwargs.get('novel_slug')
        novel = get_object_or_404(Novel, slug=novel_slug)
        return Chapter.objects.filter(novel=novel).order_by('number')

    def perform_create(self, serializer):
        novel_slug = self.kwargs.get('novel_slug')
        novel = get_object_or_404(Novel, slug=novel_slug)
        # We're making sure that only the author or an admin can add chapters to the novel.
        if novel.author != self.request.user and not self.request.user.is_staff:
            raise exceptions.PermissionDenied("Hold on there! You can't add chapters to someone else's novel.")
        # Calculate the next chapter number
        next_number = Chapter.objects.filter(novel=novel).aggregate(models.Max('number'))['number__max'] or 0
        next_number += 1
        serializer.save(novel=novel, number=next_number)

# --- The Chapter ViewSet: The all-in-one chapter machine! ---
# This viewset handles all the CRUD operations for chapters.
class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all().order_by('number')

    def get_serializer_class(self):
        return ChapterCreateUpdateSerializer if self.action in ['create', 'update', 'partial_update'] else ChapterSerializer

    def get_permissions(self):
        return [permissions.AllowAny()] if self.action in ['list', 'retrieve'] else [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Chapter.objects.filter(status='published').order_by('number')
        is_author = user.role == 'author'
        is_admin_or_staff = (user.role == 'admin' or getattr(user, 'is_staff', False))
        if is_admin_or_staff:
            return Chapter.objects.all().order_by('number')
        if is_author:
            return Chapter.objects.filter(models.Q(status='published') | models.Q(novel__author=user)).order_by('number')
        return Chapter.objects.filter(status='published').order_by('number')
    
    def perform_update(self, serializer):
        instance = serializer.save()
        # If the chapter is published, we're updating the novel's `last_updated` field.
        if instance.status == 'published' or instance.is_published:
            novel = instance.novel
            novel.last_updated = timezone.now()
            novel.save(update_fields=['last_updated'])

# --- The Paragraph ViewSet: The wordsmith's workshop! ---
# This viewset handles all the CRUD operations for paragraphs.
class ParagraphViewSet(viewsets.ModelViewSet):
    queryset = Paragraph.objects.all().order_by('order')

    def get_serializer_class(self):
        return ParagraphCreateSerializer if self.action in ['create', 'update', 'partial_update'] else ParagraphSerializer

    def get_permissions(self):
        return [permissions.AllowAny()] if self.action in ['list', 'retrieve'] else [permissions.IsAuthenticated()]

# And that's a wrap on our chapter views! They're all set to handle requests and make our app a writer's dream.
# Now, let's connect them to our URLs and we'll be ready to tell some stories! 📖
