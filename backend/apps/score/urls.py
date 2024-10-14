from django.urls import path

from .views import (GetPastScores, RankUpdate, ScoreAndRankHandler, ScoreInsertHandler)

urlpatterns = [
    path('score/process/', ScoreAndRankHandler.as_view(), name='score_process'),
    path('score/insert/', ScoreInsertHandler.as_view(), name='score-insert'),
    path('score/pastscores/', GetPastScores.as_view(), name='score_scores'),
    path('score/update_rank/', RankUpdate.as_view(), name='update_rank'),
]
