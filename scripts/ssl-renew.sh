#!/bin/bash
COMPOSE="docker compose -f docker-compose.prod.yml"

# 証明書の更新を試行
sudo $COMPOSE run certbot renew

# Nginxの設定をリロード
sudo $COMPOSE exec nginx nginx -s reload