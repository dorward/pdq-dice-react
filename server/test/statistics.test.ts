import { expect, test, vi } from 'vitest';
import { E_NO_SESSIONS } from '../src/errors';

const mocks = vi.hoisted(() => ({ query: vi.fn(), highLow: vi.fn(), skillChecks: vi.fn() }));
vi.mock('../src/dbConfig/dbConnector', () => ({ default: { query: mocks.query } }));
vi.mock('../src/model/stats/getHighLowStats', () => ({ default: mocks.highLow }));
vi.mock('../src/model/stats/getSkillChecks', () => ({ default: mocks.skillChecks }));
import getStatistics from '../src/model/getStatistics';

test('an empty statistics database returns no sessions without generating error reports', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.query.mockResolvedValueOnce({ rows: [] });
    await expect(getStatistics()).resolves.toBe(E_NO_SESSIONS);
    expect(mocks.query).toHaveBeenCalledTimes(1);
    expect(mocks.highLow).not.toHaveBeenCalled();
    expect(mocks.skillChecks).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
});

test('statistics still use the latest session when rolls exist', async () => {
    const earlier = { session_start: '2026-01-01', session_end: '2026-01-02' };
    const latest = { session_start: '2026-01-10', session_end: '2026-01-11' };
    mocks.query.mockResolvedValueOnce({ rows: [earlier, latest] });
    mocks.highLow.mockResolvedValueOnce([]);
    mocks.skillChecks.mockResolvedValueOnce([]);
    await expect(getStatistics()).resolves.toEqual({
        recentHighLow: [],
        recentSkillChecks: [],
    });
    expect(mocks.highLow).toHaveBeenCalledExactlyOnceWith(latest);
    expect(mocks.skillChecks).toHaveBeenCalledExactlyOnceWith(latest);
});
