from django.urls import path

from .views import (
    ScoreSelectView,
    ScoreInsertView,
    UserRankingView,
)

urlpatterns = [
    path("", ScoreInsertView.as_view(), name="score_insert"),
    path("select/", ScoreSelectView.as_view(), name="past_scores"),
    path("ranking/", UserRankingView.as_view(), name="user_ranking"),
]
