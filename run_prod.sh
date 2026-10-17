cp .env.production client/.env
docker compose --env-file .env.production -f docker-compose.yml --profile production up --build --remove-orphans -d
