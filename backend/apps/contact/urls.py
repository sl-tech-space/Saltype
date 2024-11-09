from django.urls import path

from .views import SubmitRequest

urlpatterns = [
    path("submit/", SubmitRequest.as_view(), name="submit-request"),
]
