cp .env.development client/.env
docker compose --env-file .env.development -f docker-compose.yml -f docker-compose.development.yml up --build --remove-orphans pdq-api
