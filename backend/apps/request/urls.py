# urls.py
from django.urls import path

from .views import SubmitRequest

urlpatterns = [
    path('request/submit/', SubmitRequest.as_view(), name='submit-request'),
]
