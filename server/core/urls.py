# Welcome to the main URL dispatch center of our project!
# This file is like the friendly receptionist at the front desk, directing every incoming request
# to the right place. Let's see where all the paths lead! 🚀

# We're bringing in the big guns: path and include for routing, and settings and static for our media files.
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Here it is, the main event! `urlpatterns` is a list of all the routes our application knows about.
# It's a "who's who" of our API endpoints.
urlpatterns = [
    # The admin site is currently taking a little nap, but it's here if we ever need it.
    # path('admin/', admin.site.urls),

    # --- API Endpoints Galore! ---
    # We're organizing our URLs by module to keep things neat and tidy.
    # Each of these lines is a gateway to a different part of our application.

    # First up, the accounts module. Everything related to users, profiles, and authentication lives here.
    path('api/accounts/', include('modules.accounts.urls')),

    # Next, the novel module. This is where you'll find all the routes for creating, reading, and managing novels.
    path('api/', include('modules.novel.urls')),

    # The tags module. For all your tagging and categorization needs.
    path('api/', include('modules.tags.urls')),

    # The genres module. From fantasy to sci-fi, this is where the magic happens.
    path('api/', include('modules.genres.urls')),

    # The reviews module. What's the verdict? Find out here.
    path('api/', include('modules.reviews.urls')),

    # The chapters module. The building blocks of our stories.
    path('api/', include('modules.chapters.urls')),

    # And last but not least, the comments module. Let's get the conversation started!
    path('api/', include('modules.comments.urls')),
]

# --- Media Files in DEBUG Mode ---
# When we're in DEBUG mode, we want to be able to see our uploaded media files.
# This little bit of magic makes that possible. It's like a backstage pass to our media folder!
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# And there you have it! A complete map of our project's URLs.
# Now you know exactly how to get around. Happy exploring! 🗺️
