# Welcome to the serializers file for our 'chapters' module!
# This is where we transform our Chapter and Paragraph models into a format that can be easily
# sent over the internet. It's like preparing our stories for their big debut on the web! 🎤

from rest_framework import serializers
from .models import Chapter, Paragraph

# --- The Paragraph Serializer: The public face of our paragraphs! ---
# This serializer determines what paragraph information we share with the world.
class ParagraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paragraph
        # We're including the 'id', 'uid', 'order', and 'text' fields in our serialized output.
        fields = ['id', 'uid', 'order', 'text']

# --- The Chapter Serializer: The full story of a chapter! ---
# This serializer is for viewing a single chapter. It includes all the juicy details.
class ChapterSerializer(serializers.ModelSerializer):
    # We're using the `ParagraphSerializer` to show the full details of the paragraphs in the chapter.
    paragraphs = ParagraphSerializer(many=True, read_only=True, help_text="The paragraphs in this chapter.")
    hero_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        # We're including all the fields from our Chapter model, plus the paragraphs.
        fields = [
            'id', 'novel', 'title', 'number', 'is_published',
            'created_at', 'updated_at', 'paragraphs', 'word_count',
            'content_html', 'content_delta', 'hero_image_url'
        ]

    def get_hero_image_url(self, obj: Chapter):
        request = self.context.get('request') if isinstance(self.context, dict) else None
        if not obj.hero_image:
            return None
        if request:
            return request.build_absolute_uri(obj.hero_image.url)
        return obj.hero_image.url

# --- The Chapter Create/Update Serializer: Let's write a new chapter! ---
# This serializer is for creating and updating chapters. It's the blank page where a new chapter begins.
class ChapterCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        # These are the fields we need to create or update a chapter.
        fields = ['title', 'number', 'is_published', 'content_html', 'content_delta', 'hero_image']
        # Allow 'number' field to be updated for chapter reordering
        extra_kwargs = {
            'is_published': {'required': False},
            'number': {'required': False}  # Make number optional but allow updates
        }

# --- The Paragraph Create Serializer: Let's add some words! ---
# This serializer is for creating new paragraphs. It's for adding the very words of our stories.
class ParagraphCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paragraph
        # These are the fields we need to create a new paragraph.
        fields = ['chapter', 'order', 'text']

# And that's a wrap on our chapter serializers! They're all set to translate our chapter data
# and make our API a joy to use. Now, let's see them in action in our views! 🎬
