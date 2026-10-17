# PostgreSQL 16 → 18 migration

These scripts perform a **dump/restore upgrade**, not `pg_upgrade`. They require
Docker Compose and Python **3.11 or newer**. Run them from this checkout on the
host that holds the existing `postgres16` container and `~/.pdq/postgres16` data.
Do not run `run_dev.sh`, `run_staging.sh`, or `run_prod.sh` until cutover: the normal
Compose configuration now targets PostgreSQL 18.

The existing backup must be a plain SQL cluster dump from `pg_dumpall -c`, as
produced by `backup_database.sh` before this upgrade. Use only a trusted backup.
The scripts never delete the old or new PostgreSQL data directories.

## Quick start

From the repository root, substitute your actual backup filename and choose
`production`, `staging`, or `development` in the first command:

```sh
./upgrade_scripts/migrate_pg16_pg18/01_restore.sh "$HOME/.pdq/backup/YOUR_BACKUP.sql" production
./upgrade_scripts/migrate_pg16_pg18/02_cutover.sh
./upgrade_scripts/migrate_pg16_pg18/03_verify.sh
```

Run each command separately and continue only when it succeeds. The first command
records the environment for the remaining commands, so do not pass it again to
`02_cutover.sh` or `03_verify.sh`. Normal cutover already builds and starts the
application; you do not need to run `run_prod.sh` afterwards to complete migration.

## When to use the normal run scripts

| Migration stage | What to run |
| --- | --- |
| Before the upgrade | `01_restore.sh` with the backup and environment. Do not run the normal start scripts against the old installation. |
| Restore complete, application stopped | `02_cutover.sh`. Do not use a normal start script to bypass the cutover checks. |
| Cutover complete | `03_verify.sh` and the manual checks below. The API and, for staging/production, frontend are already running. |
| Upgrade verified | Use the matching normal run script for subsequent rebuilds, deployments, and starts. The migration scripts are a one-time operation. |
| A migration step failed | Inspect the error and restore log; correct the problem or use the documented rollback. Do not use a normal start script as a recovery shortcut. |
| After rollback | Keep using the PostgreSQL 16 deployment configuration. The current normal scripts still target PostgreSQL 18 and must not be used until configuration is corrected. |

After a successful, verified upgrade, choose the script for this host:

- `./run_prod.sh`: rebuild and start production in detached mode with
  `.env.production` and the public application URLs.
- `./run_staging.sh`: rebuild and start production images in detached mode with
  `.env.staging` and local development URLs.
- `./run_dev.sh`: rebuild/start the development API with Nodemon in the foreground,
  using `.env.development` and the development Compose override. In another
  terminal, run `pnpm --dir client run start:dev` for the Vite frontend. Start Vite
  separately after a development cutover too; there is no need to rerun
  `run_dev.sh` just to start the frontend.

The environments share the host's database directory and ports. Choose the same
environment used for migration; these scripts do not create independent databases.
If you selected a custom `--target-dir`, export `POSTGRES_DATA_DIR` with that path
before using a normal run script so it uses the migrated data.

## 1. Restore and compare

Choose the environment for this host. For example, production:

```sh
./upgrade_scripts/migrate_pg16_pg18/01_restore.sh \
  "$HOME/.pdq/backup/dump_YYYY-MM-DD_HH_MM_SS.sql" production
```

Use `staging` or `development` instead for a local installation. The script:

- Validates the source container, backup, and Compose configuration.
- Stops this Compose project's API, frontend, and migrator; **downtime starts here**.
- Records counts, content hashes, and statistics sequence positions from PostgreSQL 16.
- Initializes a separate PostgreSQL 18.6 container without published ports, using
  the new `~/.pdq/postgres18` directory. The directory must initially be empty.
- Restores the backup and stops on the first SQL error.
- Compares restored application data with PostgreSQL 16 and runs `ANALYZE`.

Global cleanup statements are adjusted in a temporary copy of the dump: absent
databases/roles/tablespaces are allowed, and the existing bootstrap `postgres`
role is kept. Its saved `ALTER ROLE` settings/password are still restored. Database
SQL and COPY data are unchanged, and the original backup is never edited.

Stop any independently running Vite server and external database writers before
running the scripts. If the fresh backup is already out of date, comparison fails;
keep the application stopped and take another backup using:

```sh
POSTGRES_CONTAINER=postgres16 sh ./backup_database.sh
```

State and the private restore log are stored under `~/.pdq/migrate_pg16_pg18`.
Check `restore.log` if the restore fails. Do not rerun against a partially restored
directory: archive it for diagnosis and use a **new empty** target directory and
state directory via `--target-dir` and `--state-dir`. Pass that `--state-dir` to
every subsequent script. A nondefault target directory is used for the migration
commands; set `POSTGRES_DATA_DIR` to that same path for future normal Compose runs.

## 2. Cut over

```sh
./upgrade_scripts/migrate_pg16_pg18/02_cutover.sh
```

The script checks that neither database has changed since verification, copies
the selected environment file into `client/.env`, and builds the application
images. It then stops the temporary restore container and PostgreSQL 16, disables
automatic restart of the old container, and starts the normal `postgres18` service
on the new data directory. It applies SQL migrations before starting the API and
frontend. Development leaves the standalone Vite client for you to start.

For a database-only rehearsal, use `02_cutover.sh --database-only`; this does not
start the application or Discord bot. Custom container names, project names,
environment files, and directories are available on `01_restore.sh --help`.

The old PostgreSQL 16 data remains in place. Normal Compose commands may later
remove its stopped container as an orphan; rollback can recreate it from the
recorded image and directory.

## 3. Verify the application

```sh
./upgrade_scripts/migrate_pg16_pg18/03_verify.sh
```

Before cutover this compares the restored data with the recorded baseline. After
cutover it checks PostgreSQL 18 and reports current table counts, allowing for new
application writes. Also check container logs, log in, inspect characters, save a
change, roll dice, and generate Discord statistics. Reload open browser sessions
to discard their old save revisions.

The normal backup script now targets `postgres18`. Take and retain a new backup
after successful verification. Avatar storage is unchanged and is not part of the
SQL backup.

## Roll back if necessary

Rollback switches back to the retained PostgreSQL 16 files. **Writes accepted by
PostgreSQL 18 after cutover will not be present in PostgreSQL 16.** Take a backup
of PostgreSQL 18 before rollback if it has accepted writes that you need to keep.

```sh
./upgrade_scripts/migrate_pg16_pg18/04_rollback.sh --accept-pg18-write-loss
```

Use `--database-only` as well for a rehearsal. Rollback stops the new services and
recreates the old database container with its recorded image and data directory,
under the API's new `postgres` network alias. PostgreSQL 18 files are retained.

After rollback, do not use the normal run scripts: they still target PostgreSQL 18.
Restore the PostgreSQL 16 deployment configuration (including the original data
mount) before resuming normal deployments, or plan a fresh migration. If any step
fails, inspect its error and logs; the scripts do not automatically reopen the
application on an unverified database.

## Script verification

Unit tests for the dump normalization:

```sh
python3 -m unittest discover -s upgrade_scripts/migrate_pg16_pg18 -p test_migration.py
```

The opt-in end-to-end test creates disposable PostgreSQL 16 and 18 containers,
directories, an isolated Compose project, and a dynamically allocated database
port. It tests restore, comparison, cutover, sequence values, and rollback without
starting the API or bot or using your real database:

```sh
python3 upgrade_scripts/migrate_pg16_pg18/test_docker.py
```
