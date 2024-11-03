from django.urls import path

from .views import (AverageScoreView, HighestScoreCheckView, PastScoresView, RankDeterminationView,
                    ScoreInsertView, UserRankingView, UserRankUpdateView)

urlpatterns = [
    path('', ScoreInsertView.as_view(), name='score_insert'),
    path('ranking/', UserRankingView.as_view(), name='user_ranking'),
    path('past-scores/', PastScoresView.as_view(), name='past_scores'),
    path('average/', AverageScoreView.as_view(), name='average_score'),
    path('rank/update/', UserRankUpdateView.as_view(), name='update_rank'),
    path('rank/determine/', RankDeterminationView.as_view(), name='determine_rank'),
    path('highest/', HighestScoreCheckView.as_view(), name='highest_score_check'),
]
