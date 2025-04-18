#!/bin/bash

LOG_FILE="/app/logs/cron.log"
BACKUP_DIR="/app/logs/archive"

# バックアップディレクトリがなければ作成
if [ ! -d "$BACKUP_DIR" ]; then
    gosu django mkdir -p "$BACKUP_DIR"
fi

# 日付範囲を計算（前週の月曜から今週の月曜まで）
END_DATE=$(date +%Y%m%d)
START_DATE=$(date -d "7 days ago" +%Y%m%d)

# 日付範囲を含むバックアップファイル名を生成
BACKUP="${BACKUP_DIR}/cron-${START_DATE}-${END_DATE}.gz"

# 現在のログを圧縮してバックアップ
gosu django gzip -c "$LOG_FILE" > "$BACKUP"

# 元のログファイルをクリア
gosu django truncate -s 0 "$LOG_FILE"

# 古いバックアップを削除（4週間分を保持）
find "$BACKUP_DIR" -name "cron-*.gz" -type f -mtime +28 -delete

# ログローテーション完了のメッセージを追加
echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Weekly log rotation completed. Period: ${START_DATE} to ${END_DATE}" > "$LOG_FILE" 