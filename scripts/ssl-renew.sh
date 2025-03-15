#!/bin/bash
COMPOSE="/usr/local/bin/docker-compose -f docker-compose.prod.yml"

# 証明書の更新を試行
$COMPOSE run certbot renew

# Nginxの設定をリロード
$COMPOSE exec nginx nginx -s reload