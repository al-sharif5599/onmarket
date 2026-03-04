"""
URL configuration for online_shop project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path


def home(request):
    return HttpResponse("Backend is running successfully")


urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("businesses.urls")),
]

# Serve uploaded media files.
# On Render this allows direct access to files saved under MEDIA_ROOT.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
