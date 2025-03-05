#!/bin/bash

log() {
    local level="$1"
    shift
    echo "$(date '+%Y-%m-%d %H:%M:%S') [$level] $*" >> /var/log/cron.log
}

log "INFO" "Starting the script"
cd /app
if /usr/local/bin/python manage.py send_daily_scores >> /var/log/cron.log 2>&1; then
    log "INFO" "Script finished successfully"
else
    log "ERROR" "Script encountered an error"
fi
