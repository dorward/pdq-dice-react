import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import express, { type ErrorRequestHandler } from 'express';
import { ChannelType } from 'discord.js';
import { startTestServer } from './http-server';

const mocks = vi.hoisted(() => ({
    record: vi.fn<() => Promise<void>>(),
    fetch: vi.fn(),
    send: vi.fn<() => Promise<void>>(),
    d6: vi.fn<() => number>(),
}));
vi.mock('../src/discord', () => ({ default: { channels: { fetch: mocks.fetch } } }));
vi.mock('../src/util/authHelper', () => ({
    default: async () => ({
        userId: 'user',
        nickname: 'Player',
        code: 'code',
        channel: { id: 'channel' },
        characters: [],
    }),
}));
vi.mock('../src/util/d6', () => ({ default: mocks.d6 }));
vi.mock('../src/model/recordD6Roll', () => ({ default: mocks.record }));
vi.mock('../src/model/recordSkillRoll', () => ({ default: mocks.record }));
vi.mock('../src/model/recordHighLowRoll', () => ({ default: mocks.record }));
import rollRouter from '../src/routers/rollRouter';
import expendRouter from '../src/routers/expendRouter';

const app = express();
app.use(express.json());
app.use('/roll', rollRouter);
app.use('/expend', expendRouter);
let errors: unknown[] = [];
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    errors.push(error);
    res.status(500).json({ error: 'failed' });
};
app.use(errorHandler);
let http: Awaited<ReturnType<typeof startTestServer>>;
beforeAll(async () => {
    http = await startTestServer(app);
});
afterAll(() => http.close());
beforeEach(() => {
    vi.resetAllMocks();
    errors = [];
    mocks.d6.mockReturnValue(3);
    mocks.record.mockResolvedValue();
    mocks.send.mockResolvedValue();
    mocks.fetch.mockResolvedValue({ type: ChannelType.GuildText, send: mocks.send });
});
const post = (path: string, body: object) =>
    fetch(`${http.base}${path}/user/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

test.each([0, 1, 2, 4])(
    'Benny reset rolls %i independent dice and adds base Bennies',
    async (count) => {
        const values = [1, 6, 2, 4];
        let index = 0;
        mocks.d6.mockImplementation(() => values[index++]);
        const response = await post('/roll', {
            rollType: 'Benny Roll',
            defaultBennies: 3,
            diceBonus: `+${count}d6`,
        });
        expect(response.status).toBe(200);
        const result = await response.json();
        expect(mocks.d6).toHaveBeenCalledTimes(count);
        expect(result.diceResult).toEqual(values.slice(0, count));
        expect(result.total).toBe(
            3 + values.slice(0, count).reduce((sum, die) => sum + die, 0),
        );
    },
);

const cases: [string, string, object, boolean][] = [
    ['d6', '/roll', { dice: '1d6', rollType: 'd6' }, true],
    ['luck', '/roll', { dice: '1d6', rollType: 'Luck roll', high: true }, true],
    ['skill', '/roll', { dice: '2d6', rollType: 'Skill Check', bonuses: [] }, true],
    ['benny', '/roll', { rollType: 'Benny Roll', defaultBennies: 3, diceBonus: '+1d6' }, false],
    ['expend', '/expend', { extraName: 'Potion' }, false],
];
for (const [name, path, body, records] of cases) {
    describe(name, () => {
        test.each([...(records ? ['record'] : []), 'fetch', 'send'])(
            'propagates %s failures through Express',
            async (stage) => {
                const failure = new Error(`${stage} failed`);
                mocks[stage as 'record' | 'fetch' | 'send'].mockRejectedValue(failure);
                const response = await post(path, body);
                expect(response.status).toBe(500);
                expect(errors).toEqual([failure]);
                if (stage === 'record') expect(mocks.fetch).not.toHaveBeenCalled();
            },
        );
        test('waits for Discord before sending success', async () => {
            let finishSend!: () => void;
            let sending!: () => void;
            const started = new Promise<void>((resolve) => {
                sending = resolve;
            });
            mocks.send.mockImplementation(() => {
                sending();
                return new Promise<void>((resolve) => {
                    finishSend = resolve;
                });
            });
            let completed = false;
            const request = post(path, body).then((response) => {
                completed = true;
                return response;
            });
            await started;
            expect(completed).toBe(false);
            finishSend();
            expect((await request).status).toBe(200);
            expect(errors).toEqual([]);
        });
    });
}
