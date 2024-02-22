cp .env.production client/.env
env $(cat .env.production) docker-compose --profile production up --build --remove-orphans -d