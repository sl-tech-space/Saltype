from django.urls import path

from .views import (
    ScoreSelectView,
    ScoreInsertView,
    UserRankingView,
    UserRankView,
)

urlpatterns = [
    path("", ScoreInsertView.as_view(), name="score_insert"),
    path("select/", ScoreSelectView.as_view(), name="past_scores"),
    path("userranking/", UserRankingView.as_view(), name="user_ranking"),
    path("userrank/", UserRankView.as_view(), name="update_rank"),
]
