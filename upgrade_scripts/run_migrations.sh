#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <.env file>" >&2
    exit 1
fi

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repo_root"

env_file=$1
if [ ! -f "$env_file" ]; then
    echo "Environment file not found: $env_file" >&2
    exit 1
fi

# Both services share this profile in every environment; the env file selects
# the database settings. Only the explicitly named services are started.
docker compose --env-file "$env_file" -f "$repo_root/docker-compose.yml" \
    --profile development up -d postgres
docker compose --env-file "$env_file" -f "$repo_root/docker-compose.yml" \
    --profile development run --rm migrator
