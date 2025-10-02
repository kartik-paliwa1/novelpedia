# Hey there, future developer! Welcome to the heart of our Django project: the settings file!
# This is where all the magic happens. We've laid out everything to be as clear as a summer sky,
# so grab a coffee, and let's walk through this together! 🎉

from pathlib import Path
from decouple import config
# import cloudinary # We're keeping this commented out for now, but it's here if we need to manage media in the cloud!

# Let's get our bearings. BASE_DIR is our project's home base. Every path we define will start from here.
# It's like the "You Are Here" map for our code! 🗺️
BASE_DIR = Path(__file__).resolve().parent.parent

# Ah, the SECRET_KEY! This is our project's secret handshake. Keep it safe, keep it secret!
# We're using a default one for now, but for production, you'll want something super-duper secret.
SECRET_KEY = 'django-insecure-b^xrh2_o*s8nuafem47k9!&g1m(l80!mofe==%qjo86xm8&m(@'

# DEBUG mode is our best friend during development. It gives us detailed error pages.
# But like a good friend who tells you the truth, it can be a little *too* honest in production, so we turn it off then.
DEBUG = True

# ALLOWED_HOSTS is like the bouncer at a club. It decides who gets to visit our site.
# Adding localhost, 127.0.0.1, and 0.0.0.0 for development access
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]']

# Time to roll call for our INSTALLED_APPS! These are all the different parts of our Django project.
# We've got the standard Django crew, some cool third-party apps, and of course, our very own custom apps.
INSTALLED_APPS = [
    # The classics - Django's built-in apps. Can't live without 'em!
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Here are our third-party friends, adding some extra spice to our project!
    'corsheaders', # For handling those pesky cross-origin requests.
    'rest_framework', # Our go-to for building amazing APIs.
    'django_filters', # Makes filtering our data a breeze.
    'rest_framework_simplejwt', # For keeping our app secure with JSON Web Tokens.
    'django_rest_passwordreset', # "I forgot my password" - we've got you covered!
    'rest_framework.authtoken',  # For token-based authentication. A classic choice.
    'django.contrib.sites',  # Required for allauth
    'allauth',  # Django allauth for social authentication
    'allauth.account',  # Allauth account management
    'allauth.socialaccount',  # Allauth social account support
    'allauth.socialaccount.providers.google',  # Google OAuth provider

    # Our very own, home-grown apps! This is where our project's unique features live.
    'modules.accounts.apps.AccountsConfig', # Meet the accounts app!
    'modules.novel', # Where the stories unfold.
    'modules.tags', # For all your tagging needs.
    'modules.genres', # From sci-fi to romance, we've got it all.
    'modules.chapters', # The building blocks of our novels.
    'modules.reviews', # What's the verdict?
    'modules.comments', # Let's get the conversation started!
]

# --- Email Settings: For when we need to send out emails, like for password resets. ---
# For now, we're just printing emails to the console. Super handy for testing!
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# When we're ready to go live, we'll uncomment these and use a real email service.
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True

# We use decouple to keep our sensitive info out of the code. Safety first!
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='dummy_user')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='dummy_password')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# --- Media Files: Where our users' uploaded content will live. ---
# We're storing them on the local filesystem for now.
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# If we ever want to use Cloudinary for our media, we've got the settings ready to go!
# CLOUDINARY_STORAGE = {
#     'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
#     'API_KEY': config('CLOUDINARY_API_KEY'),
#     'API_SECRET': config('CLOUDINARY_API_SECRET'),
# }

# SITE_ID is used by some Django apps to identify the site. We've set it to 1, the default.
SITE_ID = 1

# --- Middleware: The guardians of our application. ---
# They process requests and responses, adding all sorts of useful features.
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # This one needs to be high up to work its magic.
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Our project's main URL configuration. It's the front door to all our API endpoints.
ROOT_URLCONF = 'core.urls'

# --- Templates: For rendering our HTML pages (if we had any!). ---
# Even though we're building an API, Django still needs this.
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# This is how our application talks to the web server. It's the bridge between our code and the outside world.
WSGI_APPLICATION = 'core.wsgi.application'

# --- Database: The brain of our operation! ---
# We're using SQLite for now because it's super easy to set up.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- Password Validation: Keeping our users' accounts secure. ---
# We've got a set of rules to make sure passwords are strong and not easily guessable.
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- Authentication Backends: How we check who's who. ---
# We've got a custom one that lets users log in with their email or username. How cool is that?
AUTHENTICATION_BACKENDS = [
    'modules.accounts.auth_backends.NameOrEmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# --- Internationalization: Making our app ready for the world! ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --- Static Files: Our CSS, JavaScript, and images. ---
STATIC_URL = 'static/'

# A little detail for our database models. No need to worry about this one.
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- Custom User Model: Because our users are special! ---
# We're using our own custom user model to add extra fields and features.
AUTH_USER_MODEL = 'accounts.MyUser'
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'name'
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'username'

# --- Django REST Framework Settings: Let's get this API party started! ---
REST_FRAMEWORK = {
    # We're using JWT for authentication. It's like a secret key that our users carry with them.
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    # We're using page number pagination to keep our API responses nice and tidy.
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 1000, # Increased from 100 to 1000 to support novels with 1000+ chapters
    # We're using DjangoFilterBackend to make filtering our data super easy.
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

# --- CORS Settings: For playing nicely with our frontend. ---
# We're allowing specific origins and enabling credentials for proper authentication.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://frontend:3000",  # For Docker internal communication
]

# Allow all origins in development for easier debugging
CORS_ALLOW_ALL_ORIGINS = True  # For development only

CORS_ALLOW_CREDENTIALS = True  # Allow credentials (cookies, authorization headers, etc.)

# Additional CORS headers for proper API communication
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# --- JWT Settings: A little more detail on our JSON Web Tokens. ---
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), # Access tokens are short-lived for security.
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1), # Refresh tokens are long-lived so users don't have to log in all the time.
    'AUTH_HEADER_TYPES': ('Bearer',), # We're using the standard "Bearer" scheme for our tokens.
}

# --- Google OAuth Configuration ---
# These settings enable Google OAuth authentication for social login
# Make sure to set these environment variables for proper OAuth functionality

GOOGLE_OAUTH2_CLIENT_ID = config('GOOGLE_OAUTH2_CLIENT_ID', default='')
GOOGLE_OAUTH2_CLIENT_SECRET = config('GOOGLE_OAUTH2_CLIENT_SECRET', default='')

# Django Allauth settings for Google OAuth
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
        'FETCH_USERINFO': True,
        'APP': {
            'client_id': GOOGLE_OAUTH2_CLIENT_ID,
            'secret': GOOGLE_OAUTH2_CLIENT_SECRET,
            'key': ''
        }
    }
}

# Allauth configuration
ACCOUNT_EMAIL_VERIFICATION = 'none'  # Skip email verification for OAuth users
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
SOCIALACCOUNT_AUTO_SIGNUP = True  # Automatically create accounts for OAuth users
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_EMAIL_REQUIRED = True

# Logging configuration for OAuth debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'modules.accounts.oauth_views': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'modules.accounts.oauth_serializers': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# And that's a wrap! You've just had a grand tour of our settings file.
# If you ever need to change how the project works, this is the place to be. Happy coding! 🚀
