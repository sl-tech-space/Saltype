from django.urls import path

from .views import SubmitRequestView

urlpatterns = [
    path("submit/", SubmitRequestView.as_view(), name="submit-request"),
]
