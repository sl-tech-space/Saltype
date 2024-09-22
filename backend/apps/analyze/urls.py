from django.urls import path
from .views import MissTypeInsertView,TopMissTypesView

urlpatterns = [
    path('mistypes/insert', MissTypeInsertView.as_view(), name='misstype_insert'),
    path('mistypes/top', TopMissTypesView.as_view(), name='misstype_top_misstypes'),
]
