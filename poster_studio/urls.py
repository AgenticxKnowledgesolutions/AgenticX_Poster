"""
URL configuration for poster_studio project.

Secured & Production-Ready Routing.
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posters.urls')),
]

# Asset Routing across Development and Production
if settings.DEBUG:
    # Development: Django's internal static/media handlers
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Production: Serve uploaded student photos in MEDIA_ROOT
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
    # If WhiteNoise is not used, provide static route fallback
    if 'whitenoise.middleware.WhiteNoiseMiddleware' not in settings.MIDDLEWARE:
        urlpatterns += [
            re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
        ]
