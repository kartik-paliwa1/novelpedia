from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from modules.novel.models import Novel
from .models import Review

@receiver([post_save, post_delete], sender=Review)
def update_novel_rating(sender, instance, **kwargs):
    novel = instance.novel
    # Recalculate the average rating and review count
    result = Review.objects.filter(novel=novel).aggregate(
        average_rating=Avg('rating'),
        review_count=Count('id')
    )
    novel.rating = result['average_rating'] or 0
    # Assuming the Novel model has a reviews_count field.
    # If not, this line would need to be adjusted.
    if hasattr(novel, 'reviews_count'):
        novel.reviews_count = result['review_count'] or 0
    novel.save()
