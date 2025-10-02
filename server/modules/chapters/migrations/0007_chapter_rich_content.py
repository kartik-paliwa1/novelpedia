from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chapters", "0006_chapter_chapters_ch_number_04755b_idx_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="chapter",
            name="content_delta",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="chapter",
            name="content_html",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="chapter",
            name="hero_image",
            field=models.ImageField(blank=True, null=True, upload_to="chapters/images/"),
        ),
    ]
