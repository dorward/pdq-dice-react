import { expect, test, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ query: vi.fn(), connect: vi.fn() }));
vi.mock('../src/dbConfig/dbConnector', () => ({ default: mocks }));
vi.mock('../src/routers/apiRouter', async () => ({
    default: (await import('express')).Router(),
}));
vi.mock('../src/routers/rootRouter', async () => ({
    default: (await import('express')).Router(),
}));
vi.mock('../src/util/saveDataUrl', () => ({ avatarPaths: { AVATAR_PATH: '/tmp' } }));
import { E_UNEXPECTED_ERROR, E_DB_ERROR, E_NO_SESSIONS } from '../src/errors';
import { getUserById } from '../src/model/getUserById';
import { getUserByCode } from '../src/model/getUserByCode';
import getSessions from '../src/model/getSessions';
import getHighLowStats from '../src/model/stats/getHighLowStats';
import getSkillChecks from '../src/model/stats/getSkillChecks';
import Server from '../src/server';
const session = { session_start: '2026-01-01', session_end: '2026-01-02' };
const cases: {
    name: string;
    run: () => Promise<unknown>;
    failure: unknown;
    rejects?: boolean;
    success: unknown;
    rows: unknown[];
}[] = [
    {
        name: 'user ID',
        run: () => getUserById('user'),
        failure: E_UNEXPECTED_ERROR,
        success: { userId: 'user' },
        rows: [{ data: { userId: 'user' } }],
    },
    {
        name: 'user code',
        run: () => getUserByCode('code'),
        failure: new Error('Query failed'),
        rejects: true,
        success: { userId: 'user' },
        rows: [{ data: { userId: 'user' } }],
    },
    {
        name: 'sessions',
        run: () => getSessions(),
        failure: E_NO_SESSIONS,
        success: [{ session_start: '2026-01-01' }],
        rows: [{ session_start: '2026-01-01' }],
    },
    {
        name: 'high-low stats',
        run: () => getHighLowStats(session),
        failure: E_DB_ERROR,
        success: [{ total_rolls: 1 }],
        rows: [{ total_rolls: 1 }],
    },
    {
        name: 'skill stats',
        run: () => getSkillChecks(session),
        failure: E_DB_ERROR,
        success: [{ highest_roll: 6 }],
        rows: [{ highest_roll: 6 }],
    },
];
test.each(cases)(
    '$name: repeated failures and recovery use pool-managed queries',
    async ({ run, failure, rejects, success, rows }) => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
        mocks.query.mockRejectedValue(new Error('Query failed'));
        for (let i = 0; i < 25; i++) {
            if (rejects) await expect(run()).rejects.toEqual(failure);
            else expect(await run()).toEqual(failure);
        }
        expect(mocks.query).toHaveBeenCalledTimes(25);
        mocks.query.mockResolvedValue({ rows });
        expect(await run()).toEqual(success);
        expect(mocks.connect).not.toHaveBeenCalled();
    },
);
test('startup checks the database without retaining a checked-out client', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mocks.query.mockImplementation((_sql: string, callback: (error: null) => void) =>
        callback(null),
    );
    new Server();
    expect(mocks.query).toHaveBeenCalledWith('SELECT 1', expect.any(Function));
    expect(mocks.connect).not.toHaveBeenCalled();
});
