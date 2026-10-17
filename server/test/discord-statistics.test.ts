import { expect, test, vi } from 'vitest';
import type { TextChannel } from 'discord.js';
const mocks = vi.hoisted(() => ({ highLow: vi.fn(), skills: vi.fn() }));
vi.mock('../src/discord', () => ({ default: {} }));
vi.mock('../src/discord/statistics/sendHighLowMessage', () => ({ default: mocks.highLow }));
vi.mock('../src/discord/statistics/sendSkillsMessage', () => ({ default: mocks.skills }));
vi.mock('../src/charts/highLowChart', () => ({
    default: () => '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
}));
import { sendStatisticsMessage } from '../src/discord/sendDiscordMessage';
const channel = {} as TextChannel;
const stats = { recentHighLow: [], recentSkillChecks: [] };

test.each(['highLow', 'skills'] as const)(
    'propagates %s report failures to the command handler',
    async (stage) => {
        const error = new Error('Report failed');
        mocks.highLow.mockResolvedValue(undefined);
        mocks.skills.mockResolvedValue(undefined);
        mocks[stage].mockRejectedValue(error);
        await expect(sendStatisticsMessage(channel, stats)).rejects.toBe(error);
        if (stage === 'highLow') expect(mocks.skills).not.toHaveBeenCalled();
    },
);

test('waits for the second report before resolving', async () => {
    mocks.highLow.mockResolvedValue(undefined);
    let finish!: () => void;
    let started!: () => void;
    const sending = new Promise<void>((resolve) => {
        started = resolve;
    });
    mocks.skills.mockImplementation(() => {
        started();
        return new Promise<void>((resolve) => {
            finish = resolve;
        });
    });
    let complete = false;
    const request = sendStatisticsMessage(channel, stats).then(() => {
        complete = true;
    });
    await sending;
    expect(complete).toBe(false);
    finish();
    await request;
});

test.each(['DB error', []])(
    'high-low helper propagates channel send failures for %j',
    async (report) => {
        const { default: sendHighLow } = await vi.importActual<
            typeof import('../src/discord/statistics/sendHighLowMessage')
        >('../src/discord/statistics/sendHighLowMessage');
        const error = new Error('Discord send failed');
        const send = vi.fn().mockRejectedValue(error);
        await expect(
            sendHighLow(report, 'Report', { send } as unknown as TextChannel),
        ).rejects.toBe(error);
        expect(send).toHaveBeenCalledTimes(1);
    },
);
