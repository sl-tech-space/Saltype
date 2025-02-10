#!/bin/bash
echo "Starting the script" >> /var/log/cron.log
cd /app
/usr/local/bin/python manage.py send_daily_scores >> /var/log/cron.log 2>&1
echo "Script finished" >> /var/log/cron.log
