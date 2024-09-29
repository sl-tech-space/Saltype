from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.mistype.urls')),
    path('api/', include('apps.score.urls')),
    path('api/', include('apps.ranking.urls')),
    path('api/', include('apps.request.urls')),
]
