# Welcome to the models file for our 'reviews' module!
# This is where we define the blueprint for our reviews. It's like creating a suggestion box for our app! 📝

from django.db import models
from django.conf import settings

# --- The Review Model: A simple but powerful tool! ---
# This model represents a review in our database. It's used to rate and comment on our novels.
class Review(models.Model):
    # The novel that this review is for.
    novel = models.ForeignKey('novel.Novel', on_delete=models.CASCADE, related_name='reviews', help_text="The novel that this review is for.")
    # The user who wrote this review.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews', help_text="The user who wrote this review.")
    
    # The rating that the user gave the novel. We're allowing decimal ratings, e.g., 4.5 stars.
    rating = models.DecimalField(max_digits=3, decimal_places=1, help_text="The rating that the user gave the novel. Out of 5 stars! ⭐")
    # The comment that the user wrote about the novel.
    comment = models.TextField(blank=True, help_text="The comment that the user wrote about the novel.")
    # The date and time that this review was created.
    created_at = models.DateTimeField(auto_now_add=True, help_text="The date and time that this review was created.")
    # The date and time that this review was last updated.
    updated_at = models.DateTimeField(auto_now=True, help_text="The date and time that this review was last updated.")

    # This is how the review will be represented as a string. It's like its official name.
    def __str__(self):
        return f"Review by {self.user} on {self.novel} ({self.rating})"

# And that's our review model! Short, sweet, and to the point.
# Now, let's move on to the serializers and bring these reviews to life! 🚀
