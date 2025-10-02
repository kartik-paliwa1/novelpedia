# Welcome to the models file for our 'chapters' module!
# This is where we define the very structure of our stories, one chapter and one paragraph at a time.
# So let's turn the page and dive into the code! 📖

from django.db import models

# --- The Chapter Model: The building blocks of our novels! ---
# This model represents a chapter in a novel. It's where the story unfolds.
class Chapter(models.Model):
    # --- Status Choices: Is it a draft or ready for the world to see? ---
    STATUS_CHOICES = (('draft', 'Draft'), ('published', 'Published'))

    # --- The Core Details: The essentials of every chapter. ---
    novel = models.ForeignKey('novel.Novel', on_delete=models.CASCADE, related_name='chapters', help_text="The novel this chapter belongs to.")
    title = models.CharField(max_length=255, help_text="The title of the chapter. Make it intriguing!")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", help_text="The current status of the chapter.")
    number = models.PositiveIntegerField(help_text="The number of the chapter in the novel.")

    # --- The Timestamps: Keeping track of time. ---
    created_at = models.DateTimeField(auto_now_add=True, help_text="When was this chapter first created?")
    updated_at = models.DateTimeField(auto_now=True, help_text="When was this chapter last updated?")

    # --- The Stats: Let's see how popular this chapter is! ---
    is_published = models.BooleanField(default=False, help_text="Is this chapter published?")
    total_views = models.PositiveIntegerField(default=0, help_text="How many times has this chapter been viewed? 👁️")
    word_count = models.PositiveIntegerField(default=0, help_text="How many words are in this chapter? ✍️")

    # --- Rich content ---
    content_html = models.TextField(blank=True, default='', help_text="Full HTML content with formatting preserved.")
    content_delta = models.JSONField(blank=True, null=True, help_text="Serialized Quill delta for structured content.")
    hero_image = models.ImageField(upload_to='chapters/images/', blank=True, null=True, help_text="Optional featured image for the chapter.")

    # This is how the chapter will be represented as a string.
    def __str__(self):
        return f"{self.title} (Novel: {self.novel.title})"

    # We're adding some indexes to our database to make searching for chapters faster.
    class Meta:
        indexes = [
            models.Index(fields=['number']),
            models.Index(fields=['created_at']),
            models.Index(fields=['status']),
        ]

# --- The Paragraph Model: The very words of our stories! ---
# This model represents a single paragraph in a chapter. It's the DNA of our novels.
class Paragraph(models.Model):
    # --- The Core Details: The essentials of every paragraph. ---
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='paragraphs', help_text="The chapter this paragraph belongs to.")
    uid = models.CharField(max_length=36, unique=True, editable=False, help_text="A unique ID for each paragraph.")
    order = models.PositiveIntegerField(help_text="The order of the paragraph within the chapter.")
    text = models.TextField(help_text="The text of the paragraph.")

    # We're overriding the `save` method to automatically generate a UUID for each paragraph.
    def save(self, *args, **kwargs):
        import uuid
        if not self.uid:
            self.uid = str(uuid.uuid4())
        super().save(*args, **kwargs)

    # This is how the paragraph will be represented as a string.
    def __str__(self):
        return f"Paragraph {self.order} of {self.chapter.title}"

# And that's our chapter and paragraph models! They're all set to store the amazing stories
# that our users will create. Now, let's move on to the serializers and bring these models to life! 🚀
