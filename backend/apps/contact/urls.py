from django.urls import path

from .views import RequestView

urlpatterns = [
    path("", RequestView.as_view(), name="submit-request"),
]
