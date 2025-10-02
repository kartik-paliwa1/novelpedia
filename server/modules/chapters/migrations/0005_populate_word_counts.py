from django.db import migrations

def populate_word_counts(apps, schema_editor):
    Chapter = apps.get_model('chapters', 'Chapter')
    for chapter in Chapter.objects.all():
        total_words = sum(len(p.text.split()) for p in chapter.paragraphs.all())
        chapter.word_count = total_words
        chapter.save(update_fields=['word_count'])

class Migration(migrations.Migration):

    dependencies = [
        ('chapters', '0004_chapter_word_count'),
    ]

    operations = [
        migrations.RunPython(populate_word_counts, reverse_code=migrations.RunPython.noop),
    ]
