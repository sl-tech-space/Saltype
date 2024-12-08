from django.urls import path

from .views import MistypeView

urlpatterns = [
    path("", MistypeView.as_view(), name="mistypes_insert"),
]
