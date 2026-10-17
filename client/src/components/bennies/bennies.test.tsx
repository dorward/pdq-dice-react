// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import axios from 'axios';
import store from '../../data/redux-store';
import { clearSession } from '../../data/session';
import { set } from '../../data/user-slice';
import { setUserCreds } from '../../data/whoami-slice';
import blankCharacter from '../../data/blankCharacter';
import saveToServer from '../../api/save-to-server';
import { Bennies } from './bennies';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));
vi.mock('../../api/save-to-server', () => ({ default: vi.fn() }));
beforeEach(() => {
    vi.resetAllMocks();
    store.dispatch(clearSession());
    const character = blankCharacter('hero');
    character.bennies.current = 2;
    store.dispatch(
        set({
            userId: 'user',
            code: 'code',
            nickname: '',
            userTag: '',
            avatar: null,
            channel: { id: 'channel', name: '', guild: '', avatar: null },
            characters: [character],
        }),
    );
    store.dispatch(setUserCreds({ userId: 'user', code: 'code' }));
});
afterEach(() => {
    cleanup();
    store.dispatch(clearSession());
});

test.each(['Network failure', 'Request failed with status code 500'])(
    'failed Benny reset displays an error, preserves Bennies, and permits retry: %s',
    async (message) => {
        let fail!: (error: Error) => void;
        vi.mocked(axios.post).mockImplementationOnce(
            () =>
                new Promise((_resolve, reject) => {
                    fail = reject;
                }),
        );
        render(
            <Provider store={store}>
                <Bennies />
            </Provider>,
        );
        const button = screen.getByRole('button', { name: 'Reset Bennies' });
        fireEvent.click(button);
        fireEvent.click(button);
        expect(axios.post).toHaveBeenCalledTimes(1);
        fail(new Error(message));
        expect((await screen.findByRole('alert')).textContent).toContain(
            'Bennies could not be reset',
        );
        expect(store.getState().user.user.characters[0].bennies.current).toBe(2);
        expect(saveToServer).not.toHaveBeenCalled();
        vi.mocked(axios.post).mockResolvedValueOnce({ data: { total: 4 } });
        fireEvent.click(button);
        await waitFor(() =>
            expect(store.getState().user.user.characters[0].bennies.current).toBe(4),
        );
        expect(screen.queryByRole('alert')).toBeNull();
        expect(saveToServer).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledTimes(2);
    },
);
