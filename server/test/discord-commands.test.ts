import { beforeEach, expect, test, vi } from 'vitest';
import { type Message, TextChannel } from 'discord.js';
const mocks = vi.hoisted(() => ({
    credentials: vi.fn(),
    statistics: vi.fn(),
    sendStatistics: vi.fn(),
    dm: vi.fn(),
}));
vi.mock('../src/model/addOrUpdateUserCredentials', () => ({ default: mocks.credentials }));
vi.mock('../src/model/getStatistics', () => ({ default: mocks.statistics }));
vi.mock('../src/discord/sendDiscordMessage', () => ({
    sendStatisticsMessage: mocks.sendStatistics,
}));
import { handleMessage } from '../src/discord/commands';
import { E_NO_SESSIONS } from '../src/errors';

const message = (content: string): Message =>
    ({
        content,
        channel: Object.create(TextChannel.prototype, {
            id: { value: 'channel' },
            guild: { value: { name: 'Guild', iconURL: () => null } },
        }),
        member: {
            user: { id: 'user', tag: 'Player', avatarURL: () => null },
            nickname: 'Player',
        },
        author: { send: mocks.dm },
    }) as unknown as Message;
beforeEach(() => {
    mocks.credentials.mockResolvedValue({});
    mocks.dm.mockResolvedValue({});
    mocks.statistics.mockResolvedValue({ recentHighLow: [], recentSkillChecks: [] });
    mocks.sendStatistics.mockResolvedValue(undefined);
});

test.each(['credentials', 'dm', 'statistics', 'sendStatistics'] as const)(
    'catches %s failures at the command boundary',
    async (stage) => {
        const error = new Error(`${stage} failed`);
        const log = vi.spyOn(console, 'error').mockImplementation(() => {});
        mocks[stage].mockRejectedValue(error);
        await expect(
            handleMessage(
                message(stage === 'credentials' || stage === 'dm' ? 'login' : 'stats'),
            ),
        ).resolves.toBeUndefined();
        expect(log).toHaveBeenCalledWith('Discord command failed', error);
        if (stage === 'credentials') expect(mocks.dm).not.toHaveBeenCalled();
    },
);

test('waits for credentials before delivering a login link', async () => {
    let finish!: () => void;
    mocks.credentials.mockImplementation(
        () =>
            new Promise<void>((resolve) => {
                finish = resolve;
            }),
    );
    const request = handleMessage(message('login'));
    expect(mocks.dm).not.toHaveBeenCalled();
    finish();
    await request;
    expect(mocks.dm).toHaveBeenCalledTimes(1);
    expect(mocks.dm.mock.calls[0][0]).toContain('login?code=');
});

test('waits for statistics delivery before completing the command', async () => {
    let finish!: () => void;
    let started!: () => void;
    const sending = new Promise<void>((resolve) => {
        started = resolve;
    });
    mocks.sendStatistics.mockImplementation(() => {
        started();
        return new Promise<void>((resolve) => {
            finish = resolve;
        });
    });
    let completed = false;
    const request = handleMessage(message('stats')).then(() => {
        completed = true;
    });
    await sending;
    expect(completed).toBe(false);
    finish();
    await request;
});

test('stats with no sessions skips report delivery without logging an error', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.statistics.mockResolvedValueOnce(E_NO_SESSIONS);
    await expect(handleMessage(message('stats'))).resolves.toBeUndefined();
    expect(mocks.sendStatistics).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
});
