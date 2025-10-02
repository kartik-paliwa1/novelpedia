# Welcome, intrepid coder, to the models file for our 'novel' module!
# This is where the magic of storytelling begins. We're defining the very structure of our novels,
# from their titles to their tags. So grab your quill, and let's write some code! 📜

from django.db import models
from django.conf import settings
from django.utils.text import slugify

# --- The Novel Model: The heart of our application! ---
# This model represents a novel in our database. It's the main attraction, the star of the show!
class Novel(models.Model):
    # --- The Core Details: The essentials of every novel. ---
    title = models.CharField(max_length=255, help_text="The title of the novel. Make it catchy! 🎣")
    slug = models.SlugField(max_length=255, unique=True, blank=True, help_text="A URL-friendly version of the title. Auto-generated if you leave it blank!")
    synopsis = models.TextField(blank=True, help_text="The full summary of the novel. Get your readers hooked!")
    short_synopsis = models.CharField(max_length=500, blank=True, help_text="A shorter version of the synopsis for previews.")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='novels',
        help_text="The brilliant author behind the novel."
    )
    cover_image = models.URLField(blank=True, null=True, help_text="The cover image URL from Cloudinary. A picture is worth a thousand words!")
    cover_image_large = models.URLField(blank=True, null=True, help_text="A larger version of the cover image URL from Cloudinary.")

    # --- Creative Blueprint: Key planning choices for the novel. ---
    primary_genre = models.ForeignKey(
        'genres.Genre',
        on_delete=models.SET_NULL,
        related_name='primary_novels',
        null=True,
        blank=True,
        help_text="The main genre that best represents this novel."
    )
    target_audience = models.CharField(
        max_length=50,
        blank=True,
        help_text="Who is this story meant for? (e.g., General, Young Adult)"
    )
    language = models.CharField(
        max_length=50,
        default='English',
        help_text="Primary language of the novel."
    )
    update_schedule = models.CharField(
        max_length=50,
        blank=True,
        help_text="How often the author plans to update (e.g., Weekly, Monthly)."
    )
    planned_length = models.CharField(
        max_length=50,
        blank=True,
        help_text="Projected length of the project (e.g., Novel, Novella)."
    )
    maturity_rating = models.CharField(
        max_length=30,
        blank=True,
        help_text="Content rating to help readers decide if it suits them."
    )

    # --- The Stats: Let's see how popular this novel is! ---
    collections = models.PositiveIntegerField(default=0, help_text="How many users have this novel in their collection?")
    likes = models.PositiveIntegerField(default=0, help_text="How many users have liked this novel? ❤️")
    views = models.PositiveIntegerField(default=0, help_text="How many times has this novel been viewed? 👁️")
    reviews_count = models.PositiveIntegerField(default=0, help_text="The total number of reviews for this novel.")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, help_text="The average rating of the novel. Out of 5 stars! ⭐")

    # --- The Timestamps: Keeping track of time. ---
    created_at = models.DateTimeField(auto_now_add=True, help_text="When was this novel first created?")
    last_updated = models.DateTimeField(auto_now=True, help_text="When was this novel last updated?")

    # --- The Relationships: Connecting the dots. ---
    tags = models.ManyToManyField('tags.Tag', blank=True, related_name='novels', help_text="Tags that describe the novel.")
    genres = models.ManyToManyField('genres.Genre', blank=True, related_name='novels', help_text="Genres that this novel belongs to.")

    # --- The Status: Is it a work in progress or a masterpiece? ---
    STATUS_CHOICES = (('Ongoing', 'Ongoing'), ('Completed', 'Completed'))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Ongoing", help_text="The current status of the novel.")

    # We're overriding the `save` method to automatically generate a slug from the title.
    def save(self, *args, **kwargs):
        # Ensure we always have a unique, stable slug derived from title
        if not self.slug:
            base = slugify(self.title) or "novel"
            candidate = base
            idx = 1
            # Avoid collisions across all novels, excluding self when updating
            while Novel.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                idx += 1
                candidate = f"{base}-{idx}"
            self.slug = candidate
        super().save(*args, **kwargs)

    # This is how the novel will be represented as a string. It's like its official name.
    def __str__(self):
        return self.title

    # We're adding some indexes to our database to make searching for novels faster.
    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['last_updated']),
            models.Index(fields=['title']),
        ]

# --- The Featured Novel Model: The cream of the crop! ---
# This model is for featuring novels on our site. It's like putting them on a pedestal!
class FeaturedNovel(models.Model):
    novel = models.ForeignKey(
        'novel.Novel',
        on_delete=models.CASCADE,
        related_name='featured_entries',
        help_text="The novel that we're featuring."
    )
    featured_at = models.DateTimeField(auto_now_add=True, help_text="When was this novel featured?")
    is_active = models.BooleanField(default=True, help_text="Is this feature currently active?")

    class Meta:
        ordering = ['-featured_at']
        verbose_name = "Featured Novel"
        verbose_name_plural = "Featured Novels"

    def __str__(self):
        return f"Featured: {self.novel.title}"
    
# --- The Bookmark Model: Saving a spot in the story! ---
# This model is for users to bookmark their favorite novels. It's like a digital dog-ear!
class Bookmark(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookmarks",
        help_text="The user who is bookmarking the novel."
    )
    novel = models.ForeignKey(
        'novel.Novel',
        on_delete=models.CASCADE,
        related_name="bookmarks",
        help_text="The novel that is being bookmarked."
    )
    created_at = models.DateTimeField(auto_now_add=True, help_text="When was this bookmark created?")

    class Meta:
        # We're making sure that a user can't bookmark the same novel twice.
        unique_together = ('user', 'novel')

    def __str__(self):
        return f"{self.user.name} bookmarked {self.novel.title}"

# And that's our novel models! They're all set to store the amazing stories that our users will create.
# Now, let's move on to the serializers and bring these models to life! 🚀
