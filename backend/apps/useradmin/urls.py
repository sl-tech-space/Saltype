from django.urls import path

from .views import UserInfoView

urlpatterns = [
    path("userinfo/", UserInfoView.as_view(), name="show_userinfo"),
]
