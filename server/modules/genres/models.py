# Welcome to the models file for our 'genres' module!
# This is where we define the blueprint for our genres. It's like creating the sections in a bookstore! 📚

from django.db import models

# --- The Genre Model: A simple but powerful tool! ---
# This model represents a genre in our database. It's used to categorize our novels.
class Genre(models.Model):
    # The name of the genre. We're making it unique so we don't have any duplicates.
    name = models.CharField(max_length=50, unique=True, help_text="The name of the genre. From 'Fantasy' to 'Sci-Fi'!")

    class Meta:
        ordering = ['name']  # Order genres alphabetically by name

    # This is how the genre will be represented as a string. It's like its official name.
    def __str__(self):
        return self.name

# And that's our genre model! Short, sweet, and to the point.
# Now, let's move on to the serializers and bring these genres to life! 🚀
