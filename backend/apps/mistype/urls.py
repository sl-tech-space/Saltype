from django.urls import path

from .views import InsertMistypeDataView, TopMistypesView

urlpatterns = [
    path('', InsertMistypeDataView.as_view(), name='mistypes_insert'),
    path('top/', TopMistypesView.as_view(), name='top_mistypes'),
]
