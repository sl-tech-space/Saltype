from django.urls import path
from .views import record_mistype_api, analyze_mistypes_api

urlpatterns = [
    path('record_mistype/', record_mistype_api, name='record_mistype_api'),
    path('analyze_mistypes/', analyze_mistypes_api, name='analyze_mistypes_api'),
]
