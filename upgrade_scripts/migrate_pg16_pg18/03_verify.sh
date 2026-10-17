#!/bin/sh
set -eu
exec python3 "$(dirname "$0")/migrate.py" verify "$@"
