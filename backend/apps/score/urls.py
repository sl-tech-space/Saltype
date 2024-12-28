from django.urls import path

from .views import (
    InsertScoreView,
    GetScoreView,
    GetUserRankingView,
    UpdateUserRankView,
)

urlpatterns = [
    path("insert/", InsertScoreView.as_view(), name="insert_score"),
    path("", GetScoreView.as_view(), name="get_score"),
    path("userranking/", GetUserRankingView.as_view(), name="get_user_ranking"),
    path("update/userrank/", UpdateUserRankView.as_view(), name="update_user_rank"),
]
