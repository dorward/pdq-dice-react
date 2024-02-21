echo "Creating new directory"
mkdir ~/.pdq
echo "Copying avatars"
cp -r avatars ~/.pdq/
echo "Preparing for SQL"
mkdir ~/.pdq/sql
echo "Exporting SQL"
docker-compose exec postgres pg_dump -U postgres pdq > ~/.pdq/sql/version_14_data.sql
echo "Done"
