from django.urls import path

from .views import GetUserView, UpdateUserView, DeleteUserView

urlpatterns = [
    path("", GetUserView.as_view(), name="user_info"),
    path("update/", UpdateUserView.as_view(), name="user_info"),
    path("delete/", DeleteUserView.as_view(), name="user_info"),
]
