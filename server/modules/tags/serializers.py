# Welcome to the serializers file for our 'tags' module!
# This is where we transform our Tag model into a format that can be easily sent over the internet.
# It's like preparing our tags for their big debut on the web! 🎤

from rest_framework import serializers
from .models import Tag

# --- The Tag Serializer: The public face of our tags! ---
# This serializer determines what tag information we share with the world.
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        # We're including the 'id' and 'name' fields in our serialized output.
        fields = ['id', 'name']

# And that's our tag serializer! Short, sweet, and to the point.
# Now, let's see it in action in our views! 🎬
