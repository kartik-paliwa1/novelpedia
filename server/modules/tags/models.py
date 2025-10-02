# Welcome to the models file for our 'tags' module!
# This is where we define the blueprint for our tags. It's like creating a label maker for our app! 🏷️

from django.db import models

# --- The Tag Model: A simple but powerful tool! ---
# This model represents a tag in our database. It's used to categorize our novels.
class Tag(models.Model):
    # The name of the tag. We're making it unique so we don't have any duplicates.
    name = models.CharField(max_length=50, unique=True, help_text="The name of the tag. Keep it short and sweet!")

    class Meta:
        ordering = ['name']  # Order tags alphabetically by name

    # This is how the tag will be represented as a string. It's like its official name.
    def __str__(self):
        return self.name

# And that's our tag model! Short, sweet, and to the point.
# Now, let's move on to the serializers and bring these tags to life! 🚀
