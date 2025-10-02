# Welcome to the serializers file for our 'comments' module!
# This is where we transform our Comment model into a format that can be easily sent over the internet.
# It's like preparing our comments for their big debut on the web! 🎤

from rest_framework import serializers
from .models import Comment

# --- The Recursive Comment Serializer: For nested replies! ---
# This serializer is a bit of a mind-bender! It's used to recursively serialize nested replies.
# It's like a Russian doll of comments! 🪆
class RecursiveCommentSerializer(serializers.Serializer):
    """Serializer for our nested replies. It's a bit of a magic trick!"""
    def to_representation(self, value):
        # We're using the parent's serializer to serialize the replies.
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

# --- The Comment Serializer: The public face of our comments! ---
# This serializer determines what comment information we share with the world.
class CommentSerializer(serializers.ModelSerializer):
    # We're making the user field read-only and showing the username instead of the user ID.
    user = serializers.ReadOnlyField(source='user.username', help_text="The username of the user who wrote this comment.")
    # We're using our recursive serializer to show the replies to this comment.
    replies = RecursiveCommentSerializer(many=True, read_only=True, help_text="The replies to this comment.")

    class Meta:
        model = Comment
        # We're including all the fields from our Comment model.
        fields = [
            'id', 'paragraph', 'chapter', 'user', 'parent', 'text',
            'image_url', 'tenor_url', 'created_at', 'updated_at', 'replies'
        ]
        # We're making some fields read-only to prevent them from being updated.
        read_only_fields = ['user', 'created_at', 'updated_at', 'replies']

    # We're adding some custom validation to make sure that a comment is associated with either a paragraph or a chapter, but not both.
    def validate(self, data):
        paragraph = data.get('paragraph')
        chapter = data.get('chapter')
        # A comment must be associated with either a paragraph or a chapter.
        if not paragraph and not chapter:
            raise serializers.ValidationError("Oops! A comment must be associated with a paragraph or a chapter.")
        # A comment can't be associated with both a paragraph and a chapter.
        if paragraph and chapter:
            raise serializers.ValidationError("Hold on there! A comment can't be associated with both a paragraph and a chapter.")
        return data

# And that's our comment serializer! It's all set to handle nested comments and keep our data clean.
# Now, let's see it in action in our views! 🎬
