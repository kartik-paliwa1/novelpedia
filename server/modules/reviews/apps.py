from django.apps import AppConfig

class ReviewsConfig(AppConfig):
    name = 'modules.reviews'

    def ready(self):
        import modules.reviews.signals
