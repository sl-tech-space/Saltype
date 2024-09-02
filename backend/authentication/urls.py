from django.urls import path
from .views import LoginView, CheckTokenView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('auth-token/', obtain_auth_token),
]