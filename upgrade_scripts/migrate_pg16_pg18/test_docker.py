#!/usr/bin/env python3
"""Explicit opt-in end-to-end test; uses disposable directories and containers only."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import uuid

from migrate import ROOT, run, sql, wait_ready


def main():
    project = 'pdq-upgrade-test-' + uuid.uuid4().hex[:10]
    source = project + '-16'
    target = project + '-18'
    with tempfile.TemporaryDirectory(prefix='pdq-upgrade-test-') as temporary:
        directory = Path(temporary)
        old_data = directory / 'old'
        old_data.mkdir()
        state = directory / 'state'
        env = directory / 'environment'
        env.write_text('ENVIRONMENT=production\nPOSTGRES_PORT=0\nAPI_URL=/api/\n'
                       'FRONTEND_URL=http://localhost:5100/\nAVATAR_PATH=/var/pdq/avatars\n'
                       'AVATAR_URL=http://localhost:5101/avatars/\nTOKEN=\n')
        try:
            run('docker', 'run', '-d', '--name', source, '--network', 'none',
                '--label', f'com.docker.compose.project={project}',
                '--label', 'com.docker.compose.service=postgres16',
                '-e', 'POSTGRES_PASSWORD=newPassword', '-e', 'POSTGRES_DB=pdq',
                '--mount', f'type=bind,source={old_data},target=/var/lib/postgresql/data',
                'postgres:16-alpine')
            wait_ready(source)
            sql(source, '''CREATE TABLE user_data(userid varchar(40) PRIMARY KEY, data jsonb);
                INSERT INTO user_data VALUES ('migration-test', '{"code":"test","revision":7}');
                CREATE TABLE notes(text text);
                INSERT INTO notes VALUES ('DROP ROLE postgres;');''')
            for table in ('statistics_d6', 'statistics_high_low', 'statistics_skill_checks'):
                sql(source, f'CREATE TABLE {table}(id serial PRIMARY KEY, note text); '
                    f"INSERT INTO {table}(note) VALUES ('example');")
            backup = directory / 'backup.sql'
            with backup.open('w') as stream:
                subprocess.run(['docker', 'exec', source, 'pg_dumpall', '-c', '-U', 'postgres'],
                               stdout=stream, check=True)
            script = str(Path(__file__).with_name('migrate.py'))
            common = ['--state-dir', str(state)]
            def invoke(command, *args):
                print(run(sys.executable, script, command, *common, *args), flush=True)
            invoke('restore', str(backup), 'staging', '--env-file', str(env),
                   '--source-container', source, '--target-container', target,
                   '--target-dir', str(directory / 'new'), '--project', project)
            invoke('verify')
            sql(source, "UPDATE user_data SET data = jsonb_set(data, '{revision}', '8')")
            rejected = subprocess.run([sys.executable, script, 'cutover', *common, '--database-only'],
                                      text=True, capture_output=True)
            assert rejected.returncode == 1 and 'changed after preflight' in rejected.stderr
            sql(source, "UPDATE user_data SET data = jsonb_set(data, '{revision}', '7')")
            invoke('cutover', '--database-only')
            invoke('verify')
            assert sql(target, 'SELECT text FROM notes') == 'DROP ROLE postgres;'
            assert sql(target, 'SELECT nextval(\'statistics_d6_id_seq\')') == '2'
            invoke('rollback', '--database-only', '--accept-pg18-write-loss')
            assert run('docker', 'exec', source, 'postgres', '--version').split()[-1].startswith('16.')
            assert sql(source, 'SELECT count(*) FROM user_data') == '1'
            assert (old_data / 'PG_VERSION').read_text().strip() == '16'
            assert json.loads((state / 'state.json').read_text())['status'] == 'rolled_back'
            sql(source, "UPDATE user_data SET data = jsonb_set(data, '{revision}', '9')")
            rejected = subprocess.run([
                sys.executable, script, 'restore', '--state-dir', str(directory / 'stale-state'),
                str(backup), 'staging', '--env-file', str(env), '--source-container', source,
                '--target-container', target + '-stale', '--target-dir', str(directory / 'stale-data'),
                '--project', project,
            ], text=True, capture_output=True)
            assert rejected.returncode == 1 and 'Restored table contents differ' in rejected.stderr
            assert sql(source, "SELECT data->>'revision' FROM user_data") == '9'
            print('PASS: real restore, verification, cutover, rollback, stale backup and changed-source guards.')
        finally:
            names = run('docker', 'ps', '-aq', '--filter', f'label=com.docker.compose.project={project}').split()
            if names:
                run('docker', 'rm', '-f', *names)
            networks = run('docker', 'network', 'ls', '-q', '--filter', f'label=com.docker.compose.project={project}').split()
            for network in networks:
                run('docker', 'network', 'rm', network)


if __name__ == '__main__':
    main()
