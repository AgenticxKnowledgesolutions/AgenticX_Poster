"""
Django settings for poster_studio project.

Secured & Production-Ready Configuration.
"""

import os
import sys
from pathlib import Path
from urllib.parse import urlparse
from django.core.exceptions import ImproperlyConfigured

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# -----------------------------------------------------------------------------
# 1. LIGHTWEIGHT ZERO-DEPENDENCY .ENV LOADER
# -----------------------------------------------------------------------------
def load_dotenv(env_path):
    """Load environment variables from a .env file if present."""
    if not env_path.exists():
        return
    try:
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                key, val = line.split('=', 1)
                key = key.strip()
                val = val.strip().strip("'\"")
                # Do not overwrite variables already provided by the host environment
                if key not in os.environ:
                    os.environ[key] = val
    except Exception as e:
        print(f"Notice: Could not load .env file: {e}", file=sys.stderr)

# Load .env file from project root
load_dotenv(BASE_DIR / '.env')


# -----------------------------------------------------------------------------
# 2. CORE SECURITY SETTINGS: DEBUG & SECRET_KEY
# -----------------------------------------------------------------------------
# DEBUG: Defaults to False in production for maximum security!
# Set DEBUG=True in your local .env file only during development.
DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 't', 'yes')

# SECRET_KEY: Must be provided via environment in production.
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY') or os.environ.get('SECRET_KEY')

if not SECRET_KEY:
    if DEBUG:
        # Development fallback (safe only for local developer testing)
        SECRET_KEY = 'django-insecure-dev-fallback-key-for-local-testing-only-change-in-production'
        print("[WARNING] Running with development fallback SECRET_KEY. Set DJANGO_SECRET_KEY in production!", file=sys.stderr)
    else:
        raise ImproperlyConfigured(
            "CRITICAL SECURITY ERROR: The DJANGO_SECRET_KEY environment variable is not set. "
            "You must generate and set a secret key in your environment or .env file before running in production with DEBUG=False."
        )
elif not DEBUG and SECRET_KEY.startswith('django-insecure-'):
    raise ImproperlyConfigured(
        "CRITICAL SECURITY ERROR: You are using an automatically generated 'django-insecure-' key in production. "
        "Generate a strong 50+ character random secret key and set it via DJANGO_SECRET_KEY."
    )


# -----------------------------------------------------------------------------
# 3. ALLOWED_HOSTS & CSRF TRUSTED ORIGINS
# -----------------------------------------------------------------------------
# Provide a comma-separated list of domain names (e.g. "mywebsite.com,www.mywebsite.com,127.0.0.1")
allowed_hosts_str = os.environ.get('ALLOWED_HOSTS', '')
if allowed_hosts_str:
    ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_str.split(',') if h.strip()]
elif DEBUG:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']
else:
    ALLOWED_HOSTS = []

# CSRF Trusted Origins for HTTPS form submissions & AJAX (e.g. "https://mywebsite.com,http://localhost:8000")
csrf_trusted_str = os.environ.get('CSRF_TRUSTED_ORIGINS', '')
if csrf_trusted_str:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in csrf_trusted_str.split(',') if o.strip()]
elif DEBUG:
    CSRF_TRUSTED_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000']
else:
    CSRF_TRUSTED_ORIGINS = []


# -----------------------------------------------------------------------------
# 4. APPLICATION & MIDDLEWARE DEFINITION
# -----------------------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'posters.apps.PostersConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Integrate WhiteNoise for efficient static asset serving in production if installed
try:
    import whitenoise
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
except ImportError:
    pass

ROOT_URLCONF = 'poster_studio.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'posters' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'poster_studio.wsgi.application'


# -----------------------------------------------------------------------------
# 5. DATABASE CONFIGURATION
# -----------------------------------------------------------------------------
# Supports standard SQLite locally, and DATABASE_URL for Postgres/MySQL in production
database_url = os.environ.get('DATABASE_URL')
if database_url:
    url = urlparse(database_url)
    engine = 'django.db.backends.sqlite3'
    if url.scheme in ('postgres', 'postgresql'):
        engine = 'django.db.backends.postgresql'
    elif url.scheme == 'mysql':
        engine = 'django.db.backends.mysql'

    if engine == 'django.db.backends.sqlite3':
        DATABASES = {
            'default': {
                'ENGINE': engine,
                'NAME': url.path[1:] if url.path else BASE_DIR / 'db.sqlite3',
            }
        }
    else:
        DATABASES = {
            'default': {
                'ENGINE': engine,
                'NAME': url.path[1:],
                'USER': url.username or '',
                'PASSWORD': url.password or '',
                'HOST': url.hostname or '',
                'PORT': url.port or '',
            }
        }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# -----------------------------------------------------------------------------
# 6. PASSWORD VALIDATION
# -----------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# -----------------------------------------------------------------------------
# 7. INTERNATIONALIZATION
# -----------------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# -----------------------------------------------------------------------------
# 8. STATIC & MEDIA ASSETS
# -----------------------------------------------------------------------------
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
# STATIC_ROOT: Where collectstatic copies files for production serving
STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise storage optimization if available
if 'whitenoise.middleware.WhiteNoiseMiddleware' in MIDDLEWARE:
    STORAGES = {
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }
    # Do not crash the build if optional asset source maps are omitted
    WHITENOISE_MANIFEST_STRICT = False

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# -----------------------------------------------------------------------------
# 9. PRODUCTION SECURITY HEADERS & SSL SETTINGS
# -----------------------------------------------------------------------------
if not DEBUG:
    # Reverse proxy header (essential for Render, Railway, Heroku, Nginx, AWS)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    # SSL / HTTPS Redirect: set SECURE_SSL_REDIRECT=True when running over HTTPS
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'False').lower() in ('true', '1', 't', 'yes')

    # Cookies only transmitted over secure HTTPS connections
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True').lower() in ('true', '1', 't', 'yes')
    CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'True').lower() in ('true', '1', 't', 'yes')

    # Browser defense headers
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

    # HTTP Strict Transport Security (HSTS)
    if SECURE_SSL_REDIRECT:
        SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', '31536000'))
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SECURE_HSTS_PRELOAD = True
    else:
        SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', '0'))
