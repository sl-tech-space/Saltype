from django.urls import path
from .views import insert_score_api

urlpatterns = [
    path('api/insert_score/', insert_score_api, name='insert_score_api'),
]