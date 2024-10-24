from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/django/', include('apps.authentication.urls')),
    path('api/django/', include('apps.mistype.urls')),
    path('api/django/', include('apps.score.urls')),
    path('api/django/', include('apps.ranking.urls')),
    path('api/django/', include('apps.request.urls')),
]
