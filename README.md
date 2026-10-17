# PDQ Dice

This is a dice bot and character management app for the [PDQ system for TTRPGs](http://evilhat.wikidot.com/pdq).

## Setup

Use pnpm 12.6.0 (install with `npm install --global pnpm@12.6.0`).
Run `pnpm install --frozen-lockfile` in the repository root, `client`, and `server`.
Each directory has its own lockfile and is installed independently.

## Discord channel permissions

Users can choose the Discord channel that receives the bot's output. This is an
intended feature; the application does not restrict output to the channel used
to log in.

Restrict the bot's Discord access to channels where users should be permitted to
direct its output. Configure its role and channel permissions accordingly, and
avoid granting Administrator permissions, which would bypass those restrictions.
Any text channel the bot can access and send messages to should be treated as an
allowed destination for user-directed output.

## Environments

Run the scripts from the repository root with Docker and Docker Compose available.
Each script copies its environment file to `client/.env` before building or starting
the application. The frontend API URL is embedded at build time.

| Environment | Command | Configuration | API | Frontend |
| --- | --- | --- | --- | --- |
| Development | `./run_dev.sh` | `.env.development` | TypeScript through tsx and Nodemon, with live source mounts | Run Vite separately with hot reload |
| Staging | `./run_staging.sh` | `.env.staging` | Compiled production image | Production bundle served by Nginx |
| Production | `./run_prod.sh` | `.env.production` | Compiled production image | Production bundle served by Nginx |

### Development

Use development for editing the application. Start the API, database, and migrator:

```sh
./run_dev.sh
```

This runs in the foreground and includes `docker-compose.development.yml`, which
mounts server source for Nodemon to reload. In another terminal, start the frontend:

```sh
cd client
pnpm run start:dev
```

Vite opens the browser at `http://localhost:5100/`. The API is at
`http://localhost:5101/api/`. Nodemon executes TypeScript without type-checking;
run `pnpm --dir server run typecheck:watch` separately for development type checks.

### Staging

Use staging to test production builds against the local development services and
URLs:

```sh
./run_staging.sh
```

`.env.staging` deliberately sets `ENVIRONMENT=production`: both Docker builds use
their production targets, while the frontend, API, and avatar URLs use localhost.
The script starts the frontend, API, database, and migrator in detached mode using
the Compose `production` profile. Open `http://localhost:5100/`; the API remains at
`http://localhost:5101/api/`. Source changes require rebuilding with the script.

### Production

Use production for the deployed application:

```sh
./run_prod.sh
```

This uses the same production builds and detached Compose profile as staging,
with `.env.production` supplying the public URLs at `https://pdq.dorward.uk/`
and `https://pdq.dorward.uk/api/`. Re-run the script to rebuild and deploy changes.

### Switching environments

The scripts use the same container names, ports, database directory
(`~/.pdq/postgres18`), and avatar directory (`~/.pdq/avatars`) on a given host.
Staging tests production builds against that existing local data; it does not
create a separate staging database. Run one environment at a time and stop the
standalone Vite server before switching to staging or production on port 5100.

For detached staging logs:

```sh
docker compose --env-file .env.staging --profile production logs -f
```

To stop staging containers, use the same environment file:

```sh
docker compose --env-file .env.staging --profile production down
```

Use `.env.production` for the equivalent production commands. The bind-mounted
database and avatar files persist when containers are removed.

## Container runtime

The production API image contains compiled JavaScript and production dependencies.
It runs as the `node` user (UID/GID 1000), with a read-only root filesystem and static
files. Only the avatar directory and temporary files are writable. Production does
not mount server source files; rebuild the image to deploy server changes.

The avatar bind mount remains `~/.pdq/avatars`. Before deploying on Linux, ensure
the directory exists and UID/GID 1000 can write it. For a directory dedicated to
this application:

```sh
mkdir -p ~/.pdq/avatars
sudo chown -R 1000:1000 ~/.pdq/avatars
```

Development source mounts are defined in `docker-compose.development.yml` and are
enabled by `./run_dev.sh`; Nodemon still reloads edited source files.

## PostgreSQL 16 to 18 upgrade

Before starting the updated stack against an existing PostgreSQL 16 installation,
follow [the migration scripts and instructions](upgrade_scripts/migrate_pg16_pg18/README.md).
The updated stack uses PostgreSQL 18 and a separate data directory; changing
images does not migrate existing data.

## Database backup and restore

The backup script is named `backup_database.sh`. With the `postgres18` container
running, create a backup from the repository root:

```sh
sh ./backup_database.sh
```

It writes `~/.pdq/backup/dump_YYYY-MM-DD_HH_MM_SS.sql` using `pg_dumpall -c`.
This is a plain SQL dump of the whole PostgreSQL cluster, including databases,
roles, and passwords, with commands to drop and recreate the saved objects.
Restore it with `psql`, rather than `pg_restore`. Keep these backups private.
Avatar files in `~/.pdq/avatars` are not included and need a separate filesystem
backup.

### Restore a backup

Restoring replaces current database contents with the selected backup. Changes
made after the backup will be lost. These examples use production; use
`.env.staging` or `.env.development` for the corresponding environment. Use a
trusted backup and a PostgreSQL version compatible with its source (currently
PostgreSQL 18, preferably the latest patched 18.x image).

1. Select the backup and confirm it is present and nonempty:

   ```sh
   restore_file="$HOME/.pdq/backup/dump_2025-10-23_18_43_12.sql"
   test -s "$restore_file"
   ```

   Replace the example filename with the backup you want to restore. Do not
   continue if the file check fails.

2. Stop the API, frontend, and migrator to prevent writes during the restore.
   Also stop any standalone development client and disconnect other database
   tools. Start only PostgreSQL if it is not already running:

   ```sh
   docker compose --env-file .env.production --profile production stop pdq-api pdq-frontend migrator
   docker compose --env-file .env.production --profile production up -d --no-deps postgres
   docker exec postgres18 pg_isready -U postgres -d postgres
   ```

   Wait until `pg_isready` reports that PostgreSQL is accepting connections.
   Take a fresh backup with `sh ./backup_database.sh` before proceeding if the
   current database is still usable, so you can recover the pre-restore state.

3. Disconnect remaining database clients, then load the selected SQL file:

   ```sh
   docker exec postgres18 psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 \
     -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND backend_type = 'client backend';"
   docker exec -i postgres18 psql -X -U postgres -d postgres -f - \
     < "$restore_file" > restore.log 2>&1
   ```

   The host shell reads the backup; it does not need to be copied into the
   container. Use `-i` without `-t`. Connect initially to `postgres`, because
   the dump drops and recreates `pdq`. Do not wrap this cluster dump in a single
   transaction: it contains database creation commands.

4. Review `restore.log` before restarting the application:

   ```sh
   rg -n 'ERROR|FATAL|PANIC' restore.log
   ```

   A clean cluster dump can report that the current `postgres` role cannot be
   dropped and that the role already exists. Drops of absent objects can also
   report errors when restoring onto a fresh cluster. These are expected only
   for the corresponding cleanup/bootstrap statements. Investigate every
   other error, especially failed `COPY`, table creation, or database connection
   commands. The restore intentionally does not enable `ON_ERROR_STOP` because
   of those bootstrap-role statements; a successful command exit alone does
   not prove that the restore succeeded. See the
   [PostgreSQL pg_dumpall restore documentation](https://www.postgresql.org/docs/16/app-pg-dumpall.html).

5. Verify the restored data and apply any migrations added since the backup:

   ```sh
   docker exec postgres18 psql -X -U postgres -d pdq -v ON_ERROR_STOP=1 \
     -c 'SELECT count(*) AS restored_users FROM user_data;' -c '\dt'
   docker compose --env-file .env.production --profile production run --rm --no-deps migrator
   ```

   Check that the user count and tables match the intended backup, and inspect
   the migration output for errors. Restoring also restores database role
   passwords; ensure the application's connection credentials match them.

6. Restart using `./run_prod.sh`, `./run_staging.sh`, or `./run_dev.sh` as
   appropriate. For development, start Vite separately as described above.
   Check container logs and test login, character data, and dice rolls. Reload
   open browser sessions so they use the restored data and save revisions.

## Save concurrency tests

Run client tests with `pnpm --dir client test`.
Run server unit and HTTP tests with `pnpm --dir server test`, or use
`pnpm --dir server run test:watch` during development.
Type-check server source and tests with `pnpm --dir server run test:typecheck`.
The server integration tests require a disposable PostgreSQL database (they create
and write a `user_data` table):

```sh
cd server
TEST_DATABASE_URL=postgres://postgres:password@localhost:5432/pdq_test pnpm run test:integration
```

User documents carry a save revision. Conflicting saves return HTTP 409; the client
stops its save queue and shows an error so unsaved characters can be exported.
Deploy the server update before the client update. Older clients do not send save
revisions and will need to reload the updated application.
