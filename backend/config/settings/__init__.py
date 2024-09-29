import os
import ssl
from pathlib import Path

import certifi
from dotenv import load_dotenv

from .base import *
""".envを読み込む"""
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(env_path)
"""環境変数を取得"""
environment = os.getenv('DJANGO_ENV', 'development')

if environment == 'production':
    from .production import *
else:
    from .local import *

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# """Dockerのデータベース"""
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': os.getenv('DB_NAME'),
#         'USER': os.getenv('DB_USER'),
#         'PASSWORD': os.getenv('DB_PASSWORD'),
#         'HOST': os.getenv('DB_HOST', 'localhost'),
#         'PORT': os.getenv('DB_PORT', '3306'),
#     }
# }
"""Postgre DB"""
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}
"""証明書のパスを指定"""
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['CURL_CA_BUNDLE'] = certifi.where()
"""SSLコンテキストを作成"""
ssl_context = ssl.create_default_context()
ssl_context.load_verify_locations(certifi.where())
"""メール設定"""
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv("EMAIL_HOST", 'smtp.gmail.com')
EMAIL_PORT = os.getenv("EMAIL_PORT", 587)
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", 'True') == 'True'
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
