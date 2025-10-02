from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Paragraph, Chapter

@receiver(post_save, sender=Paragraph)
def update_chapter_word_count_on_save(sender, instance, **kwargs):
    """
    Recalculate the word count for a chapter when a paragraph is saved.
    """
    chapter = instance.chapter
    total_words = sum(len(p.text.split()) for p in chapter.paragraphs.all())
    Chapter.objects.filter(pk=chapter.pk).update(word_count=total_words)

@receiver(post_delete, sender=Paragraph)
def update_chapter_word_count_on_delete(sender, instance, **kwargs):
    """
    Recalculate the word count for a chapter when a paragraph is deleted.
    """
    chapter = instance.chapter
    total_words = sum(len(p.text.split()) for p in chapter.paragraphs.all())
    Chapter.objects.filter(pk=chapter.pk).update(word_count=total_words)
