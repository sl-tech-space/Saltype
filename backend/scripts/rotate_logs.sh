#!/bin/bash

LOG_FILE="/app/logs/cron.log"
BACKUP_DIR="/app/logs/archive"

# バックアップディレクトリがなければ作成
if [ ! -d "$BACKUP_DIR" ]; then
    gosu django mkdir -p "$BACKUP_DIR"
fi

# 日付付きのバックアップファイル名を生成
BACKUP="${BACKUP_DIR}/cron-$(date +%Y%m%d).gz"

# 現在のログを圧縮してバックアップ
gosu django gzip -c "$LOG_FILE" > "$BACKUP"

# 元のログファイルをクリア
gosu django truncate -s 0 "$LOG_FILE"

# 古いバックアップを削除（4週間分を保持）
find "$BACKUP_DIR" -name "cron-*.gz" -type f -mtime +28 -delete

# ログローテーション完了のメッセージを追加
echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] Weekly log rotation completed. Backup: $BACKUP" > "$LOG_FILE" 