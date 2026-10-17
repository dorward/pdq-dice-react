import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { flushPendingSaves } from '../api/save-to-server';
import store from './redux-store';
import { clearSession } from './session';
import { logout } from './logout';
import { set } from './user-slice';
import { setUserCreds, setCharacterId } from './whoami-slice';
import { editCharacter } from './edit-mode-slice';
import { toggleSelected, updateDescription, useBenny } from './roll-slice';
import { updateLastRoll } from './last-roll-slice';
import { setResult } from './results-slice';
import blankCharacter from './blankCharacter';

vi.mock('../api/save-to-server', () => ({ default: vi.fn(), flushPendingSaves: vi.fn() }));
beforeEach(() => vi.mocked(flushPendingSaves).mockReset());

afterEach(() => {
    vi.unstubAllGlobals();
    store.dispatch(clearSession());
});

test('logout waits for saves before removing the token, resetting state, and replacing the URL', async () => {
    store.dispatch(clearSession());
    const initialState = store.getState();
    const saved = new Map([
        ['code', 'secret'],
        ['unrelated', 'keep'],
    ]);
    const replace = vi.fn(() => {
        expect(saved.has('code')).toBe(false);
        expect(store.getState()).toEqual(initialState);
    });
    vi.stubGlobal('window', {
        localStorage: { removeItem: (key: string) => saved.delete(key) },
        location: { replace },
    });
    const character = blankCharacter('character');
    store.dispatch(
        set({
            userId: 'user',
            code: 'secret',
            nickname: 'Name',
            userTag: 'Tag',
            avatar: null,
            channel: { id: 'channel', name: 'Channel', guild: 'Guild', avatar: null },
            characters: [character],
        }),
    );
    store.dispatch(setUserCreds({ userId: 'user', code: 'secret' }));
    store.dispatch(setCharacterId(character.id));
    store.dispatch(editCharacter(character));
    store.dispatch(toggleSelected('skill'));
    store.dispatch(updateDescription('Private description'));
    store.dispatch(useBenny());
    store.dispatch(
        updateLastRoll({ dice: '2d6', rollType: 'Skill Check', description: 'Previous roll' }),
    );
    store.dispatch(setResult({ results: [], total: 9 }));

    let finish!: () => void;
    vi.mocked(flushPendingSaves).mockImplementationOnce(
        () =>
            new Promise<void>((resolve) => {
                finish = resolve;
            }),
    );
    const beforeLogout = store.getState();
    const request = logout();
    expect(flushPendingSaves).toHaveBeenCalledExactlyOnceWith(beforeLogout.user.user);
    expect(saved.get('code')).toBe('secret');
    expect(store.getState()).toBe(beforeLogout);
    expect(replace).not.toHaveBeenCalled();
    finish();
    await request;

    expect(replace).toHaveBeenCalledExactlyOnceWith('/');
    expect(saved.get('unrelated')).toBe('keep');
    expect(store.getState()).toEqual(initialState);
});

test('a save failure preserves the token and state and prevents redirection', async () => {
    const character = blankCharacter('character');
    store.dispatch(
        set({
            userId: 'user',
            code: 'secret',
            nickname: '',
            userTag: '',
            avatar: null,
            channel: { id: 'channel', name: '', guild: '', avatar: null },
            characters: [character],
        }),
    );
    const initialState = store.getState();
    const removeItem = vi.fn();
    const replace = vi.fn();
    vi.stubGlobal('window', { localStorage: { removeItem }, location: { replace } });
    vi.mocked(flushPendingSaves).mockRejectedValueOnce(new Error('Save failed'));
    await expect(logout()).rejects.toThrow('Save failed');
    expect(removeItem).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(store.getState()).toBe(initialState);
});
