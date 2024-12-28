from django.urls import path

from .views import GetUsersView,GetUserView, UpdateUserView, DeleteUserView

urlpatterns = [
    path("get/", GetUsersView.as_view(), name="get_users"),
    path("get/byid/", GetUserView.as_view(), name="get_user"),
    path("update/", UpdateUserView.as_view(), name="update_user"),
    path("delete/", DeleteUserView.as_view(), name="delete_user"),
]
