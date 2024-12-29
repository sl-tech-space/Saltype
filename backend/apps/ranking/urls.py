from django.urls import path

from .views import GetRankingView

urlpatterns = [
    path("", GetRankingView.as_view(), name="ranking"),
]
