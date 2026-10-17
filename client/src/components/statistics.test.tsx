// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import Statistics from './statistics';

vi.mock('react-redux', () => ({ useSelector: () => ({ userId: 'owner', code: 'secret' }) }));
vi.mock('./luck-roll-statistics', () => ({ default: (): null => null }));
vi.mock('axios', () => ({ default: { get: vi.fn() } }));
afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});

const renderStatistics = () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <Statistics characterId="hero" />
        </QueryClientProvider>,
    );
};

test('loads character history and opens recorded details without a new roll', async () => {
    vi.mocked(axios.get).mockResolvedValue({
        data: {
            hasMore: false,
            checks: [
                {
                    id: 1,
                    description: 'Leap',
                    eventTime: '2026-10-17T12:00:00Z',
                    total: 11,
                    roll: 7,
                    bonus: 4,
                    benny: true,
                    bonuses: [{ name: 'Agility', value: 4 }],
                },
            ],
        },
    });
    renderStatistics();
    expect(await screen.findByText('Leap')).toBeTruthy();
    const date = screen.getByText(new Date('2026-10-17T12:00:00Z').toLocaleDateString());
    expect(date.tagName).toBe('TIME');
    expect(date.getAttribute('datetime')).toBe('2026-10-17T12:00:00Z');
    expect(vi.mocked(axios.get).mock.calls[0][0]).toContain(
        'statistics/owner/secret/hero/skill-checks',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Details for Leap' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Agility')).toBeTruthy();
    expect(within(dialog).getByText('Yes')).toBeTruthy();
    expect(within(dialog).getByText('7')).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: 'OK' }));
    expect(axios.get).toHaveBeenCalledTimes(1);
});

test('shows an empty history', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { checks: [], hasMore: false } });
    renderStatistics();
    expect(
        await screen.findByText('No skill checks recorded for this character.'),
    ).toBeTruthy();
});

test('offers retry when history cannot be loaded', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('offline'));
    renderStatistics();
    expect(await screen.findByRole('button', { name: 'Try again' })).toBeTruthy();
});

test('pages through older checks and disables Next at the end', async () => {
    vi.mocked(axios.get)
        .mockResolvedValueOnce({
            data: { checks: [{ id: 1, description: 'Latest', total: 12 }], hasMore: true },
        })
        .mockResolvedValueOnce({
            data: { checks: [{ id: 2, description: 'Older', total: 8 }], hasMore: false },
        });
    renderStatistics();
    await screen.findByText('Latest');
    expect(
        (screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Older');
    expect(vi.mocked(axios.get).mock.calls[1][1]).toMatchObject({ params: { page: 2 } });
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(
        true,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    await screen.findByText('Latest');
    expect(screen.getByRole('status').textContent).toContain('Page 1');
});
