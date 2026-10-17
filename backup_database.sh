#!/bin/sh
set -eu
umask 077
mkdir -p "$HOME/.pdq/backup"
backup_file="$HOME/.pdq/backup/dump_$(date +%Y-%m-%d_%H_%M_%S).sql"
docker exec "${POSTGRES_CONTAINER:-postgres18}" pg_dumpall -c -U postgres > "$backup_file.tmp"
mv "$backup_file.tmp" "$backup_file"
printf 'Backup saved to %s\n' "$backup_file"
