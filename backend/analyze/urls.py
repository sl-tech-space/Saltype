from django.urls import path
from .views import misstype_insert  

urlpatterns = [
    path('misstype_insert/', misstype_insert, name='misstype_insert'),
]
