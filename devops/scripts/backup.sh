#!/bin/bash
# MongoDB backup script
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"

mkdir -p "$BACKUP_DIR"
docker exec mongodb mongodump --out "$BACKUP_DIR/$TIMESTAMP"
tar -czf "$BACKUP_DIR/$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "$TIMESTAMP"
rm -rf "$BACKUP_DIR/$TIMESTAMP"
echo "Backup saved: $BACKUP_DIR/$TIMESTAMP.tar.gz"