from django.urls import path
from .views import ScoreByLangAndDiffView

urlpatterns = [
    path('ranking', ScoreByLangAndDiffView.as_view(), name='get_ranking'),
]
