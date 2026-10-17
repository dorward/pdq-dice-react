# Upgrading PDQ Dice

## Version 3 → 4

This upgrades the app from 3.x (currently 3.4.0) to 4.0.0 and migrates the
existing PostgreSQL 16 database to PostgreSQL 18. Run the commands on the host
holding the existing `postgres16` container and `~/.pdq/postgres16` data.
Docker Compose and Python 3.11 or newer are required.

The commands below use **production** and the standard container names and data
directories. For staging or development, substitute the matching `.env` file,
pass `staging` or `development` to `01_restore.sh`, and use the matching start
script at the end. Environments share database files and ports on a host: run
only one at a time. If you already migrated to PostgreSQL 18, skip steps 4–5;
still stop the app, back up PostgreSQL 18, unpack the release, and run step 6
before restarting.

Run each command separately and continue only after it succeeds. Keep the same
installation directory throughout so the Compose project and recorded migration
paths stay consistent. Do not start the version 4 app before completing the
database steps.

### 1. Download the release and stop application services

Download the 4.0.0 source tarball from [GitHub Releases](https://github.com/dorward/pdq-dice-react/releases)
to a location **outside** the installation directory. Set its absolute path below
using the actual downloaded filename, then change into the existing installation:

```sh
release_archive="$HOME/Downloads/pdq-dice-react-4.0.0.tar.gz"
cd /path/to/existing/pdq-dice-react
```

Check that the archive can be read. The extraction command in step 3 assumes the
GitHub source archive's single enclosing directory:

```sh
tar -tzf "$release_archive"
```

Stop the API/Discord bot and frontend, leaving PostgreSQL 16 running for the dump
and restore comparison:

```sh
docker stop pdq-api pdq-frontend
```

Stop any standalone Vite process and other database writers too, and ensure any
previous migrator has finished. On development installations without a frontend
container, stop only `pdq-api` and the standalone Vite process. Do not run
`docker compose down`: the PostgreSQL 16 container must remain available.

### 2. Preserve the existing configuration and files

Save the old deployment files outside the installation before overwriting them:

```sh
upgrade_backup="$HOME/.pdq/upgrade-3-to-4-$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$upgrade_backup"
chmod 700 "$upgrade_backup"
tar -czf "$upgrade_backup/installation.tar.gz" --exclude='./node_modules' --exclude='./client/node_modules' --exclude='./server/node_modules' --exclude='./postgresdata' --exclude='./.git' .
```

This includes local environment files and the old Compose configuration needed
for recovery. Retain it, the SQL dump created below, and the PostgreSQL 16 data
directory until the upgrade is verified. Separately back up the avatar files in
`~/.pdq/avatars`; these are outside the installation and SQL dump.

### 3. Unpack version 4 into the existing installation

```sh
tar -xzf "$release_archive" --strip-components=1
```

Review `.env.production` against the saved configuration and restore your local
values if the archive overwrote them. In particular, check database credentials,
Discord token, application URLs, and avatar settings. Do not copy the old Compose
file over the version 4 file: version 4 supplies the PostgreSQL 18 configuration.
The default PostgreSQL 18 target is `~/.pdq/postgres18`, which must initially be
empty for the restore. The PostgreSQL 16 directory must remain untouched.

Take a fresh database backup using the newly unpacked script, with the source
container selected explicitly:

```sh
POSTGRES_CONTAINER=postgres16 sh ./backup_database.sh
```

The script prints the backup filename. Use that exact absolute path below:

```sh
sql_backup="$HOME/.pdq/backup/dump_YYYY-MM-DD_HH_MM_SS.sql"
```

If already on PostgreSQL 18, use `POSTGRES_CONTAINER=postgres18` for the backup,
then proceed directly to step 6.

### 4. Restore PostgreSQL 16 data into PostgreSQL 18

```sh
./upgrade_scripts/migrate_pg16_pg18/01_restore.sh "$sql_backup" production
```

This restores into an isolated PostgreSQL 18 container and compares the result
with PostgreSQL 16. The application stays stopped. Do not allow writes to the old
database after taking the dump. The selected environment is recorded for the
remaining migration scripts; do not pass it again.

If this fails, inspect `~/.pdq/migrate_pg16_pg18/restore.log` and follow the
[PostgreSQL migration instructions](upgrade_scripts/migrate_pg16_pg18/README.md)
before retrying. A partially restored target must not be reused as an empty target.

### 5. Cut over the database while keeping the app stopped

```sh
./upgrade_scripts/migrate_pg16_pg18/02_cutover.sh --database-only
```

This verifies the data again, stops PostgreSQL 16, disables its automatic restart,
and starts the normal PostgreSQL 18 service. It also applies SQL migrations.
`--database-only` leaves the API, Discord bot, and frontend stopped so the following
steps can finish before users reconnect.

### 6. Run the application schema migrations

```sh
./upgrade_scripts/run_migrations.sh .env.production
```

This starts the configured PostgreSQL service and runs all application SQL
migrations, including the character ID column for skill-check statistics. The
migrations are safe to rerun, so repeating the migrations already performed by
cutover is expected. Check the output for errors before continuing.

For the PostgreSQL 16 upgrade path, verify the migrated database:

```sh
./upgrade_scripts/migrate_pg16_pg18/03_verify.sh
```

Skip this verification script if you were already on PostgreSQL 18 and did not
perform steps 4–5. In either case, check the new statistics column:

```sh
docker exec postgres18 psql -U postgres -d pdq -c '\d statistics_skill_checks'
```

Look for `characterid` with type `character varying(40)`.

### 7. Build and start version 4

```sh
./run_prod.sh
```

For staging use `./run_staging.sh`. For development use `./run_dev.sh`, then
start Vite in another terminal with `pnpm --dir client run start:dev` (install
client dependencies with `pnpm --dir client install --frozen-lockfile` first).

Inspect production service logs:

```sh
docker compose --env-file .env.production --profile production logs --tail=100 pdq-api pdq-frontend postgres
```

Reload open browser sessions, log in, inspect characters, save a change, and make
a skill check. Confirm it appears in Statistics and that its Details button opens
the recorded roll. Check Discord output too, then take a new PostgreSQL 18 backup:

```sh
sh ./backup_database.sh
```

For subsequent starts and stops, use the normal environment-specific run script
and Compose configuration. For example, stop production services with:

```sh
docker compose --env-file .env.production --profile production stop
```

### Recovery

If a migration step fails, keep application services stopped and consult the
[PostgreSQL migration recovery instructions](upgrade_scripts/migrate_pg16_pg18/README.md#roll-back-if-necessary).
The scripts retain the old PostgreSQL 16 files. Rolling back to those files loses
writes accepted by PostgreSQL 18 after cutover, so preserve a PostgreSQL 18 backup
first if users have reconnected. After rollback, restore the saved version 3 app
and PostgreSQL 16 deployment configuration before resuming service; version 4's
normal run scripts still target PostgreSQL 18.
