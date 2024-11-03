from django.urls import path

from .views import RankingView

urlpatterns = [
    path('', RankingView.as_view(), name='ranking'),
]
