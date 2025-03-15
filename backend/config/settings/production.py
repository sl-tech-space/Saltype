from .base import *

DEBUG = False

ALLOWED_HOSTS = ["saltype.japaneast.cloudapp.azure.com", "nginx"]

CORS_ALLOWED_ORIGINS = [
    "https://nginx",
    "https://saltype.japaneast.cloudapp.azure.com",
]

SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True 
