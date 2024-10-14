from django.urls import path

from .views import PastScoresSelect, RankUpdate, ScoreInsert, ScoreProcess

urlpatterns = [
    path('score/process/', ScoreProcess.as_view(), name='score_process'),
    path('score/insert/', ScoreInsert.as_view(), name='score-insert'),
    path('score/select/pastscores/', PastScoresSelect.as_view(), name='pastscores_select'),
    path('rank/update/', RankUpdate.as_view(), name='rank_update'),
]
