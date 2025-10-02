# Welcome to the serializers file for our 'genres' module!
# This is where we transform our Genre model into a format that can be easily sent over the internet.
# It's like preparing our genres for their big debut on the web! 🎤

from rest_framework import serializers
from .models import Genre

# --- The Genre Serializer: The public face of our genres! ---
# This serializer determines what genre information we share with the world.
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        # We're including the 'id' and 'name' fields in our serialized output.
        fields = ['id', 'name']

# And that's our genre serializer! Short, sweet, and to the point.
# Now, let's see it in action in our views! 🎬
