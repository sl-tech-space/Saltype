from django.urls import path
from .views import LoginView, CheckSessionView, CheckTokenView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    # path('auth-session/', CheckSessionView.as_view(), name='session_login'),
    path('auth-token/', CheckTokenView.as_view(), name='token_login'),
]