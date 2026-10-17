import { beforeEach, expect, test, vi } from 'vitest';
import express from 'express';
import { startTestServer } from './http-server';

const mocks = vi.hoisted(() => ({ query: vi.fn(), auth: vi.fn() }));
vi.mock('../src/dbConfig/dbConnector', () => ({ default: { query: mocks.query } }));
vi.mock('../src/util/authHelper', () => ({ default: mocks.auth }));
import getRecentSkillChecks from '../src/model/getRecentSkillChecks';
import statisticsRouter from '../src/routers/statisticsRouter';

beforeEach(() => {
    mocks.auth.mockResolvedValue({
        userId: 'owner',
        characters: [{ id: 'hero', name: 'Hero' }],
    });
    mocks.query.mockResolvedValue({ rows: [] });
});

test('history is scoped to the user and character, newest first, paginated in groups of 10', async () => {
    mocks.query.mockResolvedValue({
        rows: [{ id: 1, bonuses: { bonuses: [{ name: 'Power', value: 4 }] } }],
    });
    await expect(getRecentSkillChecks('owner', 'hero', 'Hero')).resolves.toEqual({
        checks: [{ id: 1, bonuses: [{ name: 'Power', value: 4 }] }],
        hasMore: false,
    });
    const [sql, params] = mocks.query.mock.calls[0];
    expect(params).toEqual(['owner', 'hero', 'Hero', 0]);
    expect(sql).toContain('userId = $1');
    expect(sql).toContain('characterId = $2');
    expect(sql).toContain('characterId IS NULL AND characterName = $3');
    expect(sql).toContain('ORDER BY eventTime DESC, id DESC');
    expect(sql).toContain('LIMIT 11 OFFSET $4');
});

test('API rejects characters outside the authenticated user and returns owned history', async () => {
    const app = express();
    app.use('/statistics', statisticsRouter);
    const server = await startTestServer(app);
    try {
        const denied = await fetch(`${server.base}/statistics/owner/code/other/skill-checks`);
        expect(denied.status).toBe(404);
        expect(mocks.query).not.toHaveBeenCalled();
        const allowed = await fetch(`${server.base}/statistics/owner/code/hero/skill-checks`);
        expect(allowed.status).toBe(200);
        expect(await allowed.json()).toEqual({ checks: [], hasMore: false });
        expect(mocks.query.mock.calls[0][1]).toEqual(['owner', 'hero', 'Hero', 0]);
    } finally {
        await server.close();
    }
});

test('API does not read history when authentication fails', async () => {
    mocks.auth.mockImplementation(async (_code, _id, res) => {
        res.sendStatus(401);
        return null;
    });
    const app = express();
    app.use(statisticsRouter);
    const server = await startTestServer(app);
    try {
        const response = await fetch(`${server.base}/owner/bad/hero/skill-checks`);
        expect(response.status).toBe(401);
        expect(mocks.query).not.toHaveBeenCalled();
    } finally {
        await server.close();
    }
});

test('returns ten checks and indicates another page when an extra row exists', async () => {
    mocks.query.mockResolvedValue({ rows: Array.from({ length: 11 }, (_, id) => ({ id })) });
    const result = await getRecentSkillChecks('owner', 'hero', 'Hero', 2);
    expect(result.checks).toHaveLength(10);
    expect(result.hasMore).toBe(true);
    expect(mocks.query.mock.calls[0][1]).toEqual(['owner', 'hero', 'Hero', 10]);
});

test('API rejects invalid page parameters and accepts later pages', async () => {
    const app = express();
    app.use(statisticsRouter);
    const server = await startTestServer(app);
    try {
        for (const page of ['0', '-1', '1.5', 'abc', '9007199254740992', '1&page=2']) {
            const response = await fetch(
                `${server.base}/owner/code/hero/skill-checks?page=${page}`,
            );
            expect(response.status).toBe(400);
        }
        expect(mocks.query).not.toHaveBeenCalled();
        const response = await fetch(`${server.base}/owner/code/hero/skill-checks?page=3`);
        expect(response.status).toBe(200);
        expect(mocks.query.mock.calls[0][1]).toEqual(['owner', 'hero', 'Hero', 20]);
    } finally {
        await server.close();
    }
});
