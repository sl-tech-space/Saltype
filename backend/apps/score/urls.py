from django.urls import path

from .views import (
    AverageScoreView,
    PastScoresView,
    ScoreInsertView,
    UserRankingView,
    UserRankView,
)

urlpatterns = [
    path("", ScoreInsertView.as_view(), name="score_insert"),
    path("ranking/", UserRankingView.as_view(), name="user_ranking"),
    path("past/", PastScoresView.as_view(), name="past_scores"),
    path("average/", AverageScoreView.as_view(), name="average_score"),
    path("rank/", UserRankView.as_view(), name="update_rank"),
]
