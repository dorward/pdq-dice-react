#!/usr/bin/env python3
"""Offline dump/restore upgrade. Never edits or deletes the PostgreSQL 16 data."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[2]
TABLES = ("user_data", "statistics_d6", "statistics_high_low", "statistics_skill_checks")


def run(*args, **kwargs):
    result = subprocess.run(args, text=True, capture_output=True, **kwargs)
    if result.returncode:
        raise RuntimeError(f"Command failed: {args[0]} {args[1]}\n{result.stderr}")
    return result.stdout.strip()


def inspect(name):
    result = subprocess.run(["docker", "inspect", name], text=True, capture_output=True)
    return json.loads(result.stdout)[0] if result.returncode == 0 else None


def sql(container, query, database="pdq"):
    return run("docker", "exec", container, "psql", "-XAt", "-v", "ON_ERROR_STOP=1",
               "-U", "postgres", "-d", database, "-c", query)


def fingerprint(container):
    """Compare table contents, including updates that do not change row counts."""
    result = {}
    for table in TABLES:
        exists = sql(container, f"SELECT to_regclass('public.{table}') IS NOT NULL") == "t"
        result[table] = sql(container, f"""
            SELECT count(*)::text || ':' || md5(COALESCE(string_agg(hash, '' ORDER BY hash), ''))
            FROM (SELECT md5(row_to_json(t)::text) AS hash FROM public.{table} AS t) AS rows
        """) if exists else None
        if table.startswith("statistics_") and exists:
            result[f"sequence:{table}"] = sql(container,
                f"SELECT last_value::text || ':' || is_called::text FROM public.{table}_id_seq")
    return result


def wait_ready(container):
    for _ in range(90):
        result = subprocess.run(["docker", "exec", container, "pg_isready", "-h", "127.0.0.1", "-U", "postgres",
                                 "-d", "postgres"], capture_output=True)
        if result.returncode == 0:
            return
        info = inspect(container)
        if not info or not info["State"]["Running"]:
            raise RuntimeError(f"{container} stopped. Inspect its Docker logs before continuing.")
        time.sleep(2)
    raise RuntimeError(f"Timed out waiting for {container} to accept connections.")


def save_state(directory, state):
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    temporary = directory / "state.json.tmp"
    temporary.write_text(json.dumps(state, indent=2) + "\n")
    temporary.replace(directory / "state.json")


def read_state(directory):
    state = json.loads((directory / "state.json").read_text())
    if state["root"] != str(ROOT):
        raise RuntimeError("Use the same checkout used to prepare this migration.")
    return state


def compose_config(state, rollback=False):
    environment = dict(os.environ, POSTGRES_DATA_DIR=state["target_dir"],
                       POSTGRES_IMAGE=state["target_image"])
    args = ["docker", "compose", "--project-name", state["project"],
            "--env-file", state["env_file"], "-f", str(ROOT / "docker-compose.yml")]
    if state["environment"] == "development":
        args += ["-f", str(ROOT / "docker-compose.development.yml")]
    args += ["--profile", "development" if state["environment"] == "development" else "production"]
    config = json.loads(run(*args, "config", "--format", "json", env=environment))
    database = config["services"]["postgres"]
    database["container_name"] = state["target_container"]
    if rollback:
        database["container_name"] = state["source_container"]
        database["image"] = state["source_image"]
        database["restart"] = state["source_restart"] or "no"
        database["volumes"] = [
            {"type": "bind", "source": state["source_dir"],
             "target": "/var/lib/postgresql/data"},
        ]
        database["environment"]["PGDATA"] = "/var/lib/postgresql/data"
        config["services"]["migrator"]["image"] = state["source_image"]
    return config


def compose(state, *args, rollback=False):
    # The resolved config includes secrets. Keep it private and remove it immediately.
    with tempfile.TemporaryDirectory(prefix="pdq-pg-migration-") as directory:
        config_file = Path(directory) / "compose.json"
        config_file.write_text(json.dumps(compose_config(state, rollback)))
        return run("docker", "compose", "--project-name", state["project"],
                   "-f", str(config_file), *args, cwd=ROOT)


def normalize_dump(source, destination):
    """Adjust only pg_dumpall's global cleanup, never database SQL or COPY data."""
    with source.open(newline=None) as incoming, destination.open("w") as outgoing:
        globals_section = True
        header_seen = False
        for line in incoming:
            if line.rstrip() == "-- PostgreSQL database cluster dump":
                header_seen = True
            if line.rstrip() == "-- PostgreSQL database dump":
                globals_section = False
            if globals_section:
                # Keep the bootstrap superuser, including its restored ALTER ROLE settings.
                if re.fullmatch(r'(?:DROP|CREATE) ROLE (?:postgres|"postgres");\s*', line):
                    continue
                line = re.sub(r"^DROP (DATABASE|ROLE|TABLESPACE) (?!IF EXISTS )",
                              r"DROP \1 IF EXISTS ", line)
            outgoing.write(line)
    if not header_seen:
        raise RuntimeError("Expected a plain SQL pg_dumpall backup, not pg_dump/custom format.")


def verify(state, container, compare_data=True):
    if not sql(container, "SHOW server_version_num", "postgres").startswith("18"):
        raise RuntimeError("The target database is not PostgreSQL 18.")
    actual = fingerprint(container)
    if compare_data and actual != state["fingerprint"]:
        raise RuntimeError("Restored table contents differ from the stopped application's PostgreSQL 16 data. "
                           "Keep the application stopped and take a new backup; do not cut over.")
    if compare_data:
        print("Verified PostgreSQL 18 and matching counts/content hashes for application tables.")
    else:
        if actual["user_data"] is None:
            raise RuntimeError("The application user_data table is missing.")
        print("Verified PostgreSQL 18. Current application-table row counts:")
        print(json.dumps({name: actual[name].split(':')[0] if actual[name] else None for name in TABLES}))


def restore(args):
    backup = args.backup.expanduser().resolve()
    if not backup.is_file() or backup.stat().st_size == 0:
        raise RuntimeError("Backup must be a nonempty SQL file.")
    with backup.open() as stream:
        if "-- PostgreSQL database cluster dump" not in stream.read(4096):
            raise RuntimeError("Expected a plain SQL pg_dumpall cluster backup.")
    if (args.state_dir / "state.json").exists():
        raise RuntimeError("Migration state already exists. Use a new --state-dir for a new rehearsal.")
    source = inspect(args.source_container)
    if not source or not source["State"]["Running"]:
        raise RuntimeError("The original PostgreSQL 16 container must be running for preflight checks.")
    if not run("docker", "exec", args.source_container, "postgres", "--version").split()[-1].startswith("16."):
        raise RuntimeError("The source container is not PostgreSQL 16.")
    data_mounts = [mount for mount in source["Mounts"] if mount["Destination"] == "/var/lib/postgresql/data"]
    if len(data_mounts) != 1 or data_mounts[0]["Type"] != "bind":
        raise RuntimeError("Expected the existing PostgreSQL 16 bind mount at /var/lib/postgresql/data.")
    target = args.target_dir.expanduser().resolve()
    if target.exists() and any(target.iterdir()):
        raise RuntimeError("The PostgreSQL 18 directory must be empty. Existing data is never overwritten.")
    source_directory = Path(data_mounts[0]["Source"]).resolve()
    if (target == source_directory or source_directory in target.parents
            or target in source_directory.parents or target in backup.parents):
        raise RuntimeError("The target directory must be separate from the original data and backup.")
    env_file = (args.env_file or ROOT / f".env.{args.environment}").resolve()
    if not env_file.is_file():
        raise RuntimeError(f"Missing environment file: {env_file}")
    project = args.project or source["Config"].get("Labels", {}).get("com.docker.compose.project") or ROOT.name
    with backup.open("rb") as stream:
        checksum = hashlib.file_digest(stream, "sha256").hexdigest()
    state = {
        "root": str(ROOT), "environment": args.environment, "env_file": str(env_file),
        "project": project, "backup": str(backup),
        "backup_sha256": checksum,
        "source_container": args.source_container, "source_image": source["Image"],
        "source_dir": data_mounts[0]["Source"], "source_restart": source["HostConfig"]["RestartPolicy"]["Name"],
        "target_dir": str(target), "target_image": args.image,
        "target_container": args.target_container, "temporary_container": args.target_container + "-migration",
        "status": "preparing",
    }
    if inspect(state["temporary_container"]) or inspect(state["target_container"]):
        raise RuntimeError("A target/migration container already exists. Nothing has been stopped.")
    compose_config(state)  # Validate configuration before stopping the application.
    save_state(args.state_dir, state)
    print("Stopping application containers. PostgreSQL 16 data will remain intact.")
    for service in ("pdq-api", "pdq-frontend", "migrator"):
        info = inspect(service)
        if info and info["Config"].get("Labels", {}).get("com.docker.compose.project") == project and info["State"]["Running"]:
            run("docker", "stop", service)
    state["fingerprint"] = fingerprint(args.source_container)
    if state["fingerprint"]["user_data"] is None:
        raise RuntimeError("The source does not contain the application's user_data table.")
    save_state(args.state_dir, state)
    target.mkdir(parents=True, exist_ok=True)
    print("Starting an isolated PostgreSQL 18 restore container without published ports.")
    compose(state, "run", "-d", "--no-deps", "--name", state["temporary_container"], "postgres")
    wait_ready(state["temporary_container"])
    print("Restoring backup (logs saved privately in the migration state directory).")
    with tempfile.TemporaryDirectory(prefix="pdq-pg-restore-") as temporary:
        normalized = Path(temporary) / "restore.sql"
        normalize_dump(backup, normalized)
        with normalized.open() as incoming, (args.state_dir / "restore.log").open("w") as log:
            result = subprocess.run(["docker", "exec", "-i", state["temporary_container"],
                                     "psql", "-X", "-v", "ON_ERROR_STOP=1", "-U", "postgres",
                                     "-d", "postgres", "-f", "-"], stdin=incoming, stdout=log, stderr=log)
        if result.returncode:
            raise RuntimeError("Restore failed. Review restore.log. The original database is unchanged.")
    verify(state, state["temporary_container"])
    sql(state["temporary_container"], "ANALYZE")
    state["status"] = "restored"
    save_state(args.state_dir, state)
    print("Restore verified. Application remains stopped. Next: 02_cutover.sh")


def cutover(args):
    state = read_state(args.state_dir)
    if state["status"] != "restored":
        raise RuntimeError("A successful restore is required before cutover.")
    if fingerprint(state["source_container"]) != state["fingerprint"]:
        raise RuntimeError("PostgreSQL 16 changed after preflight. Take a fresh backup and repeat the restore.")
    verify(state, state["temporary_container"])
    if not args.database_only:
        shutil.copyfile(state["env_file"], ROOT / "client/.env")
        services = ["pdq-api"] + ([] if state["environment"] == "development" else ["pdq-frontend"])
        print("Building application images before stopping PostgreSQL 16.")
        compose(state, "build", *services)
    if fingerprint(state["source_container"]) != state["fingerprint"]:
        raise RuntimeError("PostgreSQL 16 changed while preparing cutover. Take a fresh backup and repeat.")
    print("Stopping both database containers before switching data directories.")
    run("docker", "stop", state["temporary_container"])
    run("docker", "rm", state["temporary_container"])
    run("docker", "update", "--restart=no", state["source_container"])
    run("docker", "stop", state["source_container"])
    state["status"] = "cutting_over"
    state["database_only"] = args.database_only
    save_state(args.state_dir, state)
    compose(state, "up", "-d", "--no-deps", "postgres")
    wait_ready(state["target_container"])
    verify(state, state["target_container"])
    compose(state, "run", "--rm", "--no-deps", "migrator")
    if not args.database_only:
        compose(state, "up", "-d", "--no-deps", *services)
    state["status"] = "complete"
    save_state(args.state_dir, state)
    print("Cutover complete. Check login, character saves, dice rolls and statistics.")


def rollback(args):
    state = read_state(args.state_dir)
    if not args.accept_pg18_write_loss:
        raise RuntimeError("Rollback activates the retained PostgreSQL 16 data; later PostgreSQL 18 writes "
                           "will not be present. Re-run with --accept-pg18-write-loss to proceed.")
    for name in ("pdq-api", "pdq-frontend", "migrator", state["target_container"], state["temporary_container"]):
        info = inspect(name)
        if info and info["Config"].get("Labels", {}).get("com.docker.compose.project") == state["project"]:
            if info["State"]["Running"]:
                run("docker", "stop", name)
            if name in (state["target_container"], state["temporary_container"]):
                run("docker", "rm", name)
    old = inspect(state["source_container"])
    if old:
        if old["State"]["Running"]:
            run("docker", "stop", state["source_container"])
        run("docker", "rm", state["source_container"])
    # Recreate the old container on the new service's network alias, using its exact old image/data.
    compose(state, "up", "-d", "--no-deps", "postgres", rollback=True)
    wait_ready(state["source_container"])
    if not args.database_only:
        shutil.copyfile(state["env_file"], ROOT / "client/.env")
        services = ["pdq-api"] + ([] if state["environment"] == "development" else ["pdq-frontend"])
        compose(state, "up", "-d", "--no-deps", "--build", *services, rollback=True)
    state["status"] = "rolled_back"
    save_state(args.state_dir, state)
    print("Rollback complete. PostgreSQL 18 files are retained. Do not use normal run scripts until "
          "you have restored the PostgreSQL 16 Compose configuration or planned another cutover.")


def main():
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("restore", "cutover", "verify", "rollback"):
        command = commands.add_parser(name)
        command.add_argument("--state-dir", type=Path, default=Path.home() / ".pdq/migrate_pg16_pg18")
        if name == "restore":
            command.add_argument("backup", type=Path)
            command.add_argument("environment", choices=("development", "staging", "production"))
            command.add_argument("--env-file", type=Path)
            command.add_argument("--source-container", default="postgres16")
            command.add_argument("--target-container", default="postgres18")
            command.add_argument("--target-dir", type=Path, default=Path.home() / ".pdq/postgres18")
            command.add_argument("--project")
            command.add_argument("--image", default="postgres:18.6-alpine")
        if name in ("cutover", "rollback"):
            command.add_argument("--database-only", action="store_true", help="Rehearsal: leave the API/bot stopped")
        if name == "rollback":
            command.add_argument("--accept-pg18-write-loss", action="store_true")
    args = parser.parse_args()
    args.state_dir = args.state_dir.expanduser().resolve()
    try:
        if args.command == "restore":
            restore(args)
        elif args.command == "cutover":
            cutover(args)
        elif args.command == "rollback":
            rollback(args)
        else:
            state = read_state(args.state_dir)
            container = state["temporary_container"] if state["status"] == "restored" else state["target_container"]
            verify(state, container, compare_data=state["status"] != "complete")
    except (RuntimeError, OSError, ValueError) as error:
        print(f"Migration stopped: {error}", file=sys.stderr)
        print("No database directories have been deleted. Review the state/logs before retrying.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
