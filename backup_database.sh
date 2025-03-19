mkdir -p ~/.pdq/backup/
docker exec -t postgres16 pg_dumpall -c -U postgres > ~/.pdq/backup/dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql