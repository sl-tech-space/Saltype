from django.urls import path

from .views import AddScoreAndRankView,PastScoresView

urlpatterns = [
    path('score/pastscores', PastScoresView.as_view(), name='score_scores'),
    path('score/insert', AddScoreAndRankView.as_view(), name='score_insert'),
]