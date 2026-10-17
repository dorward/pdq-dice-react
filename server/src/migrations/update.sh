#!/bin/sh
set -eu

: "${DATABASE_URL:?DATABASE_URL must be set}"
for migration in /migrations/migration-*.sql; do
    [ -f "$migration" ] || continue
    psql -X -v ON_ERROR_STOP=1 --single-transaction "$DATABASE_URL" -f "$migration"
done
