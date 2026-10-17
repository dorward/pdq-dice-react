// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { OverlaysProvider } from '@blueprintjs/core';
import { logout } from '../data/logout';
import UserMenu from './user-menu';

vi.mock('../data/logout', () => ({ logout: vi.fn() }));
afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});

test('logout failures show an error and leave the account menu available', async () => {
    vi.mocked(logout).mockRejectedValueOnce(new Error('Save failed'));
    render(
        <OverlaysProvider>
            <UserMenu userTag="Player" nickname="Hero" />
        </OverlaysProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Player/ }));
    fireEvent.click(await screen.findByText('Logout'));
    expect((await screen.findByRole('alert')).textContent).toContain('You are still logged in');
    expect(screen.getByRole('button', { name: /Player/ })).toBeTruthy();
    expect(logout).toHaveBeenCalledTimes(1);
});
