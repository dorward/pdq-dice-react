import { test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { Pool } from 'pg';
import save from '../src/model/addOrUpdateUser';
import { E_SAVE_CONFLICT, E_BAD_CODE } from '../src/errors';
import type { User } from '../src/types';

if (!process.env.TEST_DATABASE_URL)
    throw new Error('Set TEST_DATABASE_URL to a disposable PostgreSQL database.');
const database = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
beforeAll(async () => {
    await database.query(
        'CREATE TABLE IF NOT EXISTS user_data (userid varchar(40) PRIMARY KEY, data jsonb)',
    );
});
afterAll(() => database.end());

const seed = async (id: string, revision?: number): Promise<User> => {
    const user = {
        userId: id,
        code: 'secret',
        characters: [],
        nickname: '',
        userTag: '',
        avatar: null,
        channel: { id: 'channel', name: 'channel', guild: 'guild', avatar: null },
        ...(revision === undefined ? {} : { revision }),
    };
    await database.query(
        'INSERT INTO user_data VALUES ($1,$2) ON CONFLICT (userid) DO UPDATE SET data=EXCLUDED.data',
        [id, user],
    );
    return user;
};

test('only one simultaneous save from the same revision succeeds', async () => {
    const user = await seed('concurrent', 7);
    const results = await Promise.allSettled([
        save(user.userId, user.code, { ...user, nickname: 'A' }, false, database),
        save(user.userId, user.code, { ...user, nickname: 'B' }, false, database),
    ]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    const rejected = results.find((r) => r.status === 'rejected');
    const fulfilled = results.find((r) => r.status === 'fulfilled');
    assert.ok(rejected);
    assert.ok(fulfilled);
    assert.equal(rejected.reason.message, E_SAVE_CONFLICT);
    const stored = (
        await database.query('SELECT data FROM user_data WHERE userid=$1', [user.userId])
    ).rows[0].data;
    assert.equal(stored.revision, 8);
    assert.equal(stored.nickname, fulfilled.value.rows[0].data.nickname);
});

test('legacy documents start at zero and stale saves are rejected', async () => {
    const user = await seed('legacy');
    const first = await save(user.userId, user.code, user, false, database);
    assert.equal(first.rows[0].data.revision, 1);
    await assert.rejects(save(user.userId, user.code, user, false, database), {
        message: E_SAVE_CONFLICT,
    });
    await assert.rejects(
        save(user.userId, 'wrong', { ...user, revision: 1 }, false, database),
        { message: E_BAD_CODE },
    );
    const second = await save(user.userId, user.code, first.rows[0].data, false, database);
    assert.equal(second.rows[0].data.revision, 2);
});

test('credential refresh preserves the latest saved characters and increments revision', async () => {
    const user = await seed('credentials', 2);
    await save(
        user.userId,
        user.code,
        { ...user, characters: [{ id: 'new-character' } as User['characters'][number]] },
        false,
        database,
    );
    const refreshed = await save(
        user.userId,
        'new-code',
        { ...user, code: 'new-code' },
        true,
        database,
    );
    assert.equal(refreshed.rows[0].data.revision, 4);
    assert.deepEqual(refreshed.rows[0].data.characters, [{ id: 'new-character' }]);
    await assert.rejects(save(user.userId, user.code, user, false, database), {
        message: E_BAD_CODE,
    });
});
