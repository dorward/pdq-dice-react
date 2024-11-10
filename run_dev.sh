cp .env.development client/.env
env $(cat .env.development) /Users/david/.docker/cli-plugins/docker-compose up --build --remove-orphans pdq-api
