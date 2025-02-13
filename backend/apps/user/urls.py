from django.urls import path

from .views import (
    GetUsersView,
    GetUserView,
    UpdateUserView,
    DeleteUserView,
    PasswordResetView,
)

urlpatterns = [
    path("", GetUsersView.as_view(), name="get_users"),
    path("<uuid:user_id>/", GetUserView.as_view(), name="get_user"),
    path("update/", UpdateUserView.as_view(), name="update_user"),
    path("delete/", DeleteUserView.as_view(), name="delete_user"),
    path("password_reset/", PasswordResetView.as_view(), name="password_reset"),
    path('password_reset/<str:token>/', PasswordResetView.as_view(), name='password_reset'),  # トークン付きURL
]
