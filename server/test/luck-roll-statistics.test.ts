import { beforeEach, expect, test, vi } from 'vitest';
import express from 'express';
import { startTestServer } from './http-server';

const mocks = vi.hoisted(() => ({ query: vi.fn(), auth: vi.fn() }));
vi.mock('../src/dbConfig/dbConnector', () => ({ default: { query: mocks.query } }));
vi.mock('../src/util/authHelper', () => ({ default: mocks.auth }));
import getLuckRolls from '../src/model/getLuckRolls';
import statisticsRouter from '../src/routers/statisticsRouter';

beforeEach(() => {
    mocks.query.mockResolvedValue({
        rows: [
            {
                rolls: [],
                total: '0',
                successes: '0',
                high: '0',
                highSuccesses: '0',
                low: '0',
                lowSuccesses: '0',
            },
        ],
    });
    mocks.auth.mockResolvedValue({
        userId: 'owner',
        characters: [{ id: 'hero', name: 'Hero' }],
    });
});

test('calculates separate success rates from all history while limiting recent rows to five', async () => {
    mocks.query.mockResolvedValue({
        rows: [
            {
                rolls: [{ id: 10 }],
                total: '10',
                successes: '7',
                high: '4',
                highSuccesses: '1',
                low: '6',
                lowSuccesses: '6',
            },
        ],
    });
    await expect(getLuckRolls('owner', 'hero', 'Hero')).resolves.toEqual({
        rolls: [{ id: 10 }],
        percentages: { overall: 70, high: 25, low: 100 },
    });
    const [sql, params] = mocks.query.mock.calls[0];
    expect(params).toEqual(['owner', 'hero', 'Hero']);
    expect(sql).toContain('userId = $1 AND (characterId = $2');
    expect(sql).toContain('characterId IS NULL AND characterName = $3');
    expect(sql).toContain('ORDER BY "eventTime" DESC, id DESC LIMIT 5');
    expect(sql).toContain('FROM filtered');
    expect(sql).toContain('WHERE "seekingHigh" AND success');
    expect(sql).toContain('WHERE NOT "seekingHigh" AND success');
});

test('rates with no recorded rolls are unavailable', async () => {
    await expect(getLuckRolls('owner', 'hero', 'Hero')).resolves.toEqual({
        rolls: [],
        percentages: { overall: null, high: null, low: null },
    });
});

test('luck API authenticates and checks character ownership', async () => {
    const app = express();
    app.use(statisticsRouter);
    const server = await startTestServer(app);
    try {
        expect((await fetch(`${server.base}/owner/code/other/luck-rolls`)).status).toBe(404);
        expect(mocks.query).not.toHaveBeenCalled();
        const response = await fetch(`${server.base}/owner/code/hero/luck-rolls`);
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            rolls: [],
            percentages: { overall: null, high: null, low: null },
        });
        mocks.query.mockClear();
        mocks.auth.mockImplementation(async (_code, _id, res) => {
            res.sendStatus(401);
            return null;
        });
        expect((await fetch(`${server.base}/owner/bad/hero/luck-rolls`)).status).toBe(401);
        expect(mocks.query).not.toHaveBeenCalled();
    } finally {
        await server.close();
    }
});
