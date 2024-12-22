from django.urls import path

from .views import InsertMistypesView, GetTopMistypesView

urlpatterns = [
    path("insert/", InsertMistypesView.as_view(), name="insert_mistypes"),
    path("get/topmistypes/", GetTopMistypesView.as_view(), name="get_topmistypes"),
]
