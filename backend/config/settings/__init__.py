import os
import ssl
from pathlib import Path

import certifi
from dotenv import load_dotenv
from .base import *

""".envを読み込む"""
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)
"""環境変数を取得"""
environment = os.getenv("DJANGO_ENV", "development")

if environment == "production":
    from .production import *
else:
    from .local import *

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False") == "True"

"""Postgres DB"""
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
        "OPTIONS": {
            "client_encoding": "UTF8",
        },
    }
}

"""メール設定"""
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = os.getenv("EMAIL_PORT", 587)
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

"""管理者のメールアドレス"""
ADMIN_EMAILS = os.getenv("ADMIN_EMAILS", "").split(",")

"""受信者のメールアドレス"""
RECIPIENT_EMAILS = os.getenv("RECIPIENT_EMAILS", "").split(",")

"""送信者のメールアドレス"""
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}
