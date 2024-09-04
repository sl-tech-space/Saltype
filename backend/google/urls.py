from django.urls import path, include

urlpatterns = [
    path('google-auth/', include('drf_social_oauth2.urls')),
]