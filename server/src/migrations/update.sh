cd /migrations
ls migration-*.sql | xargs cat | psql -Atx $DATABASE_URL psql 
