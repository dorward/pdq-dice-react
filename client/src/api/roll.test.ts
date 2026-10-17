import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import axios from 'axios';
import store from '../data/redux-store';
import { set } from '../data/user-slice';
import { reset, toggleSelected } from '../data/roll-slice';
import { setCharacterId, setUserCreds } from '../data/whoami-slice';
import { markClear } from '../data/results-slice';
import saveToServer from './save-to-server';
import { d6, skillCheck } from './roll';
import type { Character, User } from '../types';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));
vi.mock('./save-to-server', () => ({ default: vi.fn() }));
const character = (id: string): Character => ({
    id,
    name: id,
    player: '',
    motivation: '',
    origin: '',
    codeName: '',
    qualities: [],
    powers: [],
    extras: [],
    bennies: { current: 3, max: '3' },
    inventory: [
        { id: 'potion', name: 'Potion', location: '', count: 3, value: 2 },
        { id: 'infinite', name: 'Infinite', location: '', count: '∞', value: 1 },
        { id: 'empty', name: 'Empty', location: '', count: 0, value: 1 },
        { id: 'unused', name: 'Unused', location: '', count: 5, value: 1 },
    ],
});
const result = { results: [] as { name: string; value: string }[], total: 9 };
afterEach(() => vi.restoreAllMocks());
const inventory = (id = 'first') =>
    store.getState().user.user.characters.find((c) => c.id === id).inventory;
const counts = (id = 'first') => inventory(id).map((item) => item.count);

beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user: User = {
        userId: 'user',
        code: 'code',
        nickname: '',
        userTag: '',
        avatar: null,
        channel: { id: 'channel', name: '', guild: '', avatar: null },
        characters: [character('first'), character('second')],
    };
    store.dispatch(set(user));
    store.dispatch(setUserCreds({ userId: 'user', code: 'code' }));
    store.dispatch(setCharacterId('first'));
    store.dispatch(reset());
    store.dispatch(markClear());
    inventory()
        .filter((item) => item.name !== 'Unused')
        .forEach((item) => store.dispatch(toggleSelected(item.id)));
});

test('pending and failed rolls neither consume nor save inventory', async () => {
    let fail!: (error: Error) => void;
    vi.mocked(axios.post).mockImplementationOnce(
        () =>
            new Promise((_resolve, reject) => {
                fail = reject;
            }),
    );
    const request = skillCheck();
    expect(counts()).toEqual([3, '∞', 0, 5]);
    expect(saveToServer).not.toHaveBeenCalled();
    fail(new Error('Discord unavailable'));
    await request;
    expect(counts()).toEqual([3, '∞', 0, 5]);
    expect(saveToServer).not.toHaveBeenCalled();
    expect(store.getState().results).toMatchObject({
        loading: false,
        roll: null,
        error: expect.any(String),
    });
});
test('successful rolls consume only selected finite inventory once', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: result });
    await skillCheck();
    expect(counts()).toEqual([2, '∞', 0, 5]);
    expect(saveToServer).toHaveBeenCalledTimes(1);
    expect(store.getState().results).toMatchObject({
        loading: false,
        roll: result,
        error: null,
    });
    expect(vi.mocked(axios.post).mock.calls[0][1]).toMatchObject({
        bonuses: [
            { name: 'Potion', value: 2 },
            { name: 'Infinite', value: 1 },
        ],
    });
});
test('successful retries consume inventory only once', async () => {
    vi.mocked(axios.post)
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockResolvedValueOnce({ data: result });
    await skillCheck();
    await skillCheck();
    expect(counts()).toEqual([2, '∞', 0, 5]);
    expect(saveToServer).toHaveBeenCalledTimes(1);
});
test('Benny rerolls do not consume inventory again', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: result });
    await skillCheck();
    await skillCheck({ isUsingBenny: true });
    expect(counts()).toEqual([2, '∞', 0, 5]);
    expect(saveToServer).toHaveBeenCalledTimes(2);
});
test.each(['Network failure', 'Request failed with status code 500'])(
    'failed Benny requests preserve Bennies and allow retry: %s',
    async (message) => {
        vi.mocked(axios.post).mockResolvedValueOnce({ data: result });
        await skillCheck();
        vi.mocked(saveToServer).mockClear();
        let fail!: (error: Error) => void;
        vi.mocked(axios.post).mockImplementationOnce(
            () =>
                new Promise((_resolve, reject) => {
                    fail = reject;
                }),
        );
        const request = skillCheck({ isUsingBenny: true });
        expect(store.getState().results.loading).toBe(true);
        expect(store.getState().user.user.characters[0].bennies.current).toBe(3);
        expect(saveToServer).not.toHaveBeenCalled();
        await skillCheck({ isUsingBenny: true });
        expect(axios.post).toHaveBeenCalledTimes(2);
        fail(new Error(message));
        await request;
        expect(store.getState().user.user.characters[0].bennies.current).toBe(3);
        expect(store.getState().roll.usedBenny).toBe(false);
        expect(store.getState().results).toMatchObject({
            loading: false,
            error: expect.any(String),
        });
        expect(saveToServer).not.toHaveBeenCalled();
        // A completed reroll still costs a Benny even when its result is worse.
        vi.mocked(axios.post).mockResolvedValueOnce({ data: { ...result, total: 2 } });
        await skillCheck({ isUsingBenny: true });
        expect(store.getState().user.user.characters[0].bennies.current).toBe(2);
        expect(store.getState().roll.usedBenny).toBe(true);
        expect(store.getState().results.roll.total).toBe(2);
        expect(counts()).toEqual([2, '∞', 0, 5]);
        expect(saveToServer).toHaveBeenCalledTimes(1);
        await skillCheck({ isUsingBenny: true });
        expect(axios.post).toHaveBeenCalledTimes(3);
    },
);
test('pending Benny rerolls charge the original character on success', async () => {
    let finish!: (value: { data: typeof result }) => void;
    vi.mocked(axios.post).mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                finish = resolve;
            }),
    );
    const request = skillCheck({ isUsingBenny: true });
    store.dispatch(setCharacterId('second'));
    finish({ data: result });
    await request;
    expect(store.getState().user.user.characters.map((c) => c.bennies.current)).toEqual([2, 3]);
});
test('switching characters while pending consumes from the original character', async () => {
    let finish!: (value: { data: typeof result }) => void;
    vi.mocked(axios.post).mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                finish = resolve;
            }),
    );
    const request = skillCheck();
    store.dispatch(setCharacterId('second'));
    finish({ data: result });
    await request;
    expect(counts('first')).toEqual([2, '∞', 0, 5]);
    expect(counts('second')).toEqual([3, '∞', 0, 5]);
});

test.each([undefined, true, false])(
    'd6/luck failure clears loading and permits retry (high=%s)',
    async (high) => {
        vi.mocked(axios.post)
            .mockRejectedValueOnce(new Error('Request failed'))
            .mockResolvedValueOnce({ data: result });
        await expect(d6({ high })).resolves.toBeUndefined();
        expect(store.getState().results).toMatchObject({
            loading: false,
            roll: null,
            error: expect.any(String),
        });
        expect(store.getState().user.user).not.toBeNull();
        store.dispatch(markClear());
        await d6({ high });
        expect(store.getState().results).toMatchObject({
            loading: false,
            roll: result,
            error: null,
        });
    },
);
