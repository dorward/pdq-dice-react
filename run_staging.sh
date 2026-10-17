cp .env.staging client/.env
docker compose --env-file .env.staging -f docker-compose.yml --profile production up --build --remove-orphans -d
