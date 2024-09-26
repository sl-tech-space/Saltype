from django.urls import path

from .views import GetPastScores, ScoreAndRankHandler

urlpatterns = [
    path('score/insert', ScoreAndRankHandler.as_view(), name='score_insert'),
    path('score/pastscores', GetPastScores.as_view(), name='score_scores')
]
