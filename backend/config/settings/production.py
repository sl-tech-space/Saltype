from .base import *

DEBUG = False

ALLOWED_HOSTS = ["saltype.japaneast.cloudapp.azure.com", "nginx"]

CORS_ALLOWED_ORIGINS = [
    "http://nginx",
    "http://saltype.japaneast.cloudapp.azure.com",
    "https://saltype.japaneast.cloudapp.azure.com",
]
