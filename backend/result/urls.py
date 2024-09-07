from django.urls import path
from .views import insert_score_api
from . import views

urlpatterns = [
    path('api/insert_score/', insert_score_api, name='insert_score_api'),
    path('api/scores/', views.add_score, name='add_score'),
]