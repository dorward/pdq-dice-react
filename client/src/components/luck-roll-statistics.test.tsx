// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import LuckRollStatistics from './luck-roll-statistics';

vi.mock('react-redux', () => ({ useSelector: () => ({ userId: 'owner', code: 'secret' }) }));
vi.mock('axios', () => ({ default: { get: vi.fn() } }));
afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});
const renderLuck = () =>
    render(
        <QueryClientProvider
            client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
        >
            <LuckRollStatistics characterId="hero" />
        </QueryClientProvider>,
    );

test('shows recent luck rolls and rounds all-history success rates to whole percentages', async () => {
    vi.mocked(axios.get).mockResolvedValue({
        data: {
            rolls: [
                {
                    id: 1,
                    eventTime: '2026-10-17T12:00:00Z',
                    seekingHigh: true,
                    roll: 5,
                    success: true,
                },
                {
                    id: 2,
                    eventTime: '2026-10-16T12:00:00Z',
                    seekingHigh: false,
                    roll: 6,
                    success: false,
                },
            ],
            percentages: { overall: 66.6667, high: 100, low: 0 },
        },
    });
    renderLuck();
    const table = await screen.findByRole('table', { name: 'Luck rolls' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('High')).toBeTruthy();
    expect(within(table).getByText('Low')).toBeTruthy();
    expect(within(table).getByText('Success')).toBeTruthy();
    expect(within(table).getByText('Failure')).toBeTruthy();
    const allIcon = screen.getByRole('img', { name: 'Success rate for all luck rolls' });
    const highIcon = screen.getByRole('img', { name: 'Success rate for high luck rolls' });
    const lowIcon = screen.getByRole('img', { name: 'Success rate for low luck rolls' });
    for (const [percentage, icon] of [
        ['67%', allIcon],
        ['100%', highIcon],
        ['0%', lowIcon],
    ] as const) {
        expect(screen.getByText(percentage).getAttribute('aria-describedby')).toBe(icon.id);
    }
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText('0%')).toBeTruthy();
    expect(vi.mocked(axios.get).mock.calls[0][0]).toContain(
        'statistics/owner/secret/hero/luck-rolls',
    );
});

test('shows unavailable percentages when there are no rolls', async () => {
    vi.mocked(axios.get).mockResolvedValue({
        data: { rolls: [], percentages: { overall: null, high: null, low: null } },
    });
    renderLuck();
    expect(await screen.findByText('No luck rolls recorded for this character.')).toBeTruthy();
    expect(screen.getAllByText('—')).toHaveLength(3);
});
