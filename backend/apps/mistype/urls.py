from django.urls import path

from .views import MistypeDataView, TopMistypesView

urlpatterns = [
    path("", MistypeDataView.as_view(), name="mistypes_insert"),
    path("top/", TopMistypesView.as_view(), name="top_mistypes"),
]
