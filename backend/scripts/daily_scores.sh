#!/bin/bash

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [$1] $2"
}

# 作業ディレクトリを設定
cd /app || {
    log "ERROR" "Failed to change directory to /app"
    exit 1
}

log "INFO" "Starting daily scores job"
python manage.py send_daily_scores 2>&1

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    log "INFO" "Daily scores job completed successfully"
else
    log "ERROR" "Daily scores job failed"
fi
