from django.urls import path
from .views import MissTypeInsertView

urlpatterns = [
    path('mistypes/', MissTypeInsertView.as_view(), name='misstype_insert'),
]
