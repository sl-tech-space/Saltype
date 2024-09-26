from django.urls import path
from .views import GetRanking

urlpatterns = [
    path('ranking', GetRanking.as_view(), name='get_ranking'),
]
