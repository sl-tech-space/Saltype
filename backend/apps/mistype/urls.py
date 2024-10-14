from django.urls import path

from .views import GetTopMissTypes, InsertMisTypes

urlpatterns = [
    path('mistypes/insert/', InsertMisTypes.as_view(), name='misstype_insert'),
    path('mistypes/top/', GetTopMissTypes.as_view(), name='misstype_top_misstypes'),
]
