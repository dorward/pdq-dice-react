echo "Deleting existing data";
docker container exec -i $(docker-compose ps -q postgres16) psql -U postgres pdq -c "DROP table user_data"
echo "Importing SQL"
docker container exec -i $(docker-compose ps -q postgres16) psql -U postgres pdq < ~/.pdq/sql/version_14_data.sql
echo "Done"
