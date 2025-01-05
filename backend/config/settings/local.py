from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "nginx"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://nginx",
]