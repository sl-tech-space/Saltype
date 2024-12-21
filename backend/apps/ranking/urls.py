from django.urls import path

from .views import GetRankingView

urlpatterns = [
    path("get/", GetRankingView.as_view(), name="ranking"),
]
