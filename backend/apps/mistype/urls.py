from django.urls import path

from .views import GetTopMisTypes, InsertMisTypes

urlpatterns = [
    path('mistypes/insert/', InsertMisTypes.as_view(), name='misstype_insert'),
    path('mistypes/top/', GetTopMisTypes.as_view(), name='get_topmisstypes'),
]
