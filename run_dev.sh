cp .env.development client/.env
env $(cat .env.development) docker-compose up --build --remove-orphans pdq-api