from django.urls import path
from .views import AddScoreAndRankView

urlpatterns = [
    path('score/insert', AddScoreAndRankView.as_view(), name='score_insert'),
]