cp .env.production client/.env
env $(cat .env.production) docker-compose up --build --remove-orphans -d