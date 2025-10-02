from django.apps import AppConfig


class ChaptersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.chapters'

    def ready(self):
        import modules.chapters.signals
