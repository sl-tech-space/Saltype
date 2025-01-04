from django.urls import path

from .views import (
    InsertScoreView,
    GetScoreView,
    GetUserRankingView,
    GetUserRankView,
)

urlpatterns = [
    path("insert/", InsertScoreView.as_view(), name="insert_score"),
    path("", GetScoreView.as_view(), name="get_score"),
    path("userranking/", GetUserRankingView.as_view(), name="get_user_ranking"),
    path("userrank/", GetUserRankView.as_view(), name="get_user_rank"),
]
