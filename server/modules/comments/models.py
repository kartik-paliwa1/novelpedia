# Welcome to the models file for our 'comments' module!
# This is where we define the blueprint for our comments. It's like creating a conversation for our app! 💬

from django.db import models
from django.conf import settings

# --- The Comment Model: A simple but powerful tool! ---
# This model represents a comment in our database. It's used to comment on our chapters and paragraphs.
class Comment(models.Model):
    # A comment can be linked to either a paragraph or a chapter, but not both.
    paragraph = models.ForeignKey(
        'chapters.Paragraph', on_delete=models.CASCADE, related_name='comments', null=True, blank=True,
        help_text="The paragraph that this comment is for."
    )
    chapter = models.ForeignKey(
        'chapters.Chapter', on_delete=models.CASCADE, related_name='comments', null=True, blank=True,
        help_text="The chapter that this comment is for."
    )

    # The user who wrote this comment.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments',
        help_text="The user who wrote this comment."
    )

    # A comment can be a reply to another comment.
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies',
        help_text="The parent comment that this comment is a reply to."
    )

    # The text content of the comment.
    text = models.TextField(help_text="The text content of the comment.")

    # A comment can have an image embedded in it.
    image_url = models.URLField(
        blank=True, null=True, help_text="An optional image embedded in the comment."
    )

    # A comment can have a Tenor GIF embedded in it.
    tenor_url = models.URLField(
        blank=True, null=True, help_text="An optional Tenor GIF embedded in the comment."
    )

    # The date and time that this comment was created.
    created_at = models.DateTimeField(auto_now_add=True, help_text="The date and time that this comment was created.")
    # The date and time that this comment was last updated.
    updated_at = models.DateTimeField(auto_now=True, help_text="The date and time that this comment was last updated.")

    class Meta:
        # We're ordering the comments by creation date.
        ordering = ['created_at']

    # This is how the comment will be represented as a string. It's like its official name.
    def __str__(self):
        target = self.paragraph or self.chapter
        target_type = 'Paragraph' if self.paragraph else 'Chapter' if self.chapter else 'Unknown'
        return f"Comment by {self.user} on {target_type} {target.id if target else 'N/A'}"

# And that's our comment model! Short, sweet, and to the point.
# Now, let's move on to the serializers and bring these comments to life! 🚀
