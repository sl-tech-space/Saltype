from django.urls import path

from .views import (
    ScoreSelectView,
    ScoreInsertView,
    UserRankingView,
    UserRankView,
)

urlpatterns = [
    path("insert/", ScoreInsertView.as_view(), name="insert_score"),
    path("get/", ScoreSelectView.as_view(), name="get_scores"),
    path("get/userranking/", UserRankingView.as_view(), name="get_userranking"),
    path("update/userrank/", UserRankView.as_view(), name="update_userrank"),
]
