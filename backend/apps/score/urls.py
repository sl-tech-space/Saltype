from django.urls import path

from .views import AddScoreAndRankView,AverageScoreView,PastScoresView

urlpatterns = [
    path('score/pastscores', PastScoresView.as_view(), name='score_scores'),
    path('score/insert', AddScoreAndRankView.as_view(), name='score_insert'),
    path('score/average/<int:lang_id>/<int:diff_id>', AverageScoreView.as_view(), name='score_average'),
]