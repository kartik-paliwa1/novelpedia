from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("novel", "0006_novel_status"),
        ("genres", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="novel",
            name="primary_genre",
            field=models.ForeignKey(
                blank=True,
                help_text="The main genre that best represents this novel.",
                null=True,
                on_delete=models.deletion.SET_NULL,
                related_name="primary_novels",
                to="genres.genre",
            ),
        ),
        migrations.AddField(
            model_name="novel",
            name="target_audience",
            field=models.CharField(
                blank=True,
                help_text="Who is this story meant for? (e.g., General, Young Adult)",
                max_length=50,
            ),
        ),
        migrations.AddField(
            model_name="novel",
            name="language",
            field=models.CharField(
                default="English",
                help_text="Primary language of the novel.",
                max_length=50,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="novel",
            name="update_schedule",
            field=models.CharField(
                blank=True,
                help_text="How often the author plans to update (e.g., Weekly, Monthly).",
                max_length=50,
            ),
        ),
        migrations.AddField(
            model_name="novel",
            name="planned_length",
            field=models.CharField(
                blank=True,
                help_text="Projected length of the project (e.g., Novel, Novella).",
                max_length=50,
            ),
        ),
        migrations.AddField(
            model_name="novel",
            name="maturity_rating",
            field=models.CharField(
                blank=True,
                help_text="Content rating to help readers decide if it suits them.",
                max_length=30,
            ),
        ),
    ]
