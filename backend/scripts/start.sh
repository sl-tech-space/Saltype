#!/bin/bash

# 環境変数をcrontabに反映
envsubst < /etc/cron.d/app-cron > /etc/cron.d/app-cron.tmp
mv /etc/cron.d/app-cron.tmp /etc/cron.d/app-cron
chmod 0644 /etc/cron.d/app-cron

# cronサービスをrootで起動（バックグラウンドで）
cron

# マイグレーション実行
gosu django python manage.py makemigrations
gosu django python manage.py migrate

# Gunicornを非rootユーザー(django)で実行
exec gosu django gunicorn config.wsgi:application --bind 0.0.0.0:8000
