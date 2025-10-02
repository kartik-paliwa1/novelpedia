# Welcome to the serializers file for our 'reviews' module!
# This is where we transform our Review model into a format that can be easily sent over the internet.
# It's like preparing our reviews for their big debut on the web! 🎤

from rest_framework import serializers
from .models import Review

# --- The Review Serializer: The public face of our reviews! ---
# This serializer determines what review information we share with the world.
class ReviewSerializer(serializers.ModelSerializer):
    # We're making the user field read-only and showing the username instead of the user ID.
    user = serializers.ReadOnlyField(source='user.username', help_text="The username of the user who wrote this review.")

    class Meta:
        model = Review
        # We're including all the fields from our Review model.
        fields = ['id', 'novel', 'user', 'rating', 'comment', 'created_at', 'updated_at']

# And that's our review serializer! Short, sweet, and to the point.
# Now, let's see it in action in our views! 🎬
