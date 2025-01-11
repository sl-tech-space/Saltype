from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "django", "nginx"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://django",
    "http://nginx",
]
