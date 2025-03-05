from django.urls import path

from .views import GenerateTextView

urlpatterns = [
    path("generate/", GenerateTextView.as_view(), name="generate_text"),
]
