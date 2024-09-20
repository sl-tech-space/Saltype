from django.urls import path, include
from .views import LoginView, CheckTokenView, GoogleAuthView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('auth-token/', CheckTokenView.as_view(), name='token_login'),
    path('google-auth/', GoogleAuthView.as_view(), name='google_login'),
    path('auth/', include('drf_social_oauth2.urls', namespace='drf')),
]