// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { dump } from 'js-yaml';
import store from '../data/redux-store';
import { clearSession } from '../data/session';
import { set } from '../data/user-slice';
import blankCharacter from '../data/blankCharacter';
import saveToServer from '../api/save-to-server';
import NewCharacter from './new-character';
import type { Character } from '../types';

vi.mock('../api/save-to-server', () => ({ default: vi.fn() }));
beforeEach(() => {
    vi.clearAllMocks();
    store.dispatch(clearSession());
    store.dispatch(
        set({
            userId: 'user',
            code: 'code',
            nickname: '',
            userTag: '',
            avatar: null,
            channel: { id: 'channel', name: '', guild: '', avatar: null },
            characters: [blankCharacter('existing')],
        }),
    );
});
afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    store.dispatch(clearSession());
});

test.each(['yaml', 'json'] as const)(
    '%s imports display errors without changing existing data and allow retry',
    async (format) => {
        const view = render(
            <Provider store={store}>
                <NewCharacter />
            </Provider>,
        );
        const input = view.container.querySelector('input[type="file"]');
        const original = store.getState().user.user;
        const upload = (text: string) =>
            fireEvent.change(input, {
                target: { files: [new File([text], `hero.${format}`, { type: 'text/plain' })] },
            });
        upload(format === 'json' ? '{"sheet":' : 'sheet: [');
        expect((await screen.findByRole('alert')).textContent).toContain('invalid');
        expect(store.getState().user.user).toBe(original);
        expect(saveToServer).not.toHaveBeenCalled();
        upload(format === 'json' ? '{}' : 'name: Missing attributes');
        await waitFor(() =>
            expect(screen.getByRole('alert').textContent).toContain('qualities must be a list'),
        );
        expect(store.getState().user.user).toBe(original);
        expect(saveToServer).not.toHaveBeenCalled();
        const character: { sheet: Pick<Character, 'name' | 'qualities' | 'powers'> } = {
            sheet: { name: 'Imported hero', qualities: [], powers: [] },
        };
        upload(format === 'json' ? JSON.stringify(character) : dump(character));
        await waitFor(() => expect(store.getState().user.user.characters).toHaveLength(2));
        expect(store.getState().user.user.characters[1].name).toBe('Imported hero');
        expect(screen.queryByRole('alert')).toBeNull();
        expect(saveToServer).toHaveBeenCalledTimes(1);
    },
);

test('file read errors display an import error without saving', async () => {
    vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function () {
        this.dispatchEvent(new ProgressEvent('error'));
    });
    const view = render(
        <Provider store={store}>
            <NewCharacter />
        </Provider>,
    );
    fireEvent.change(view.container.querySelector('input[type="file"]'), {
        target: { files: [new File(['{}'], 'hero.json')] },
    });
    expect((await screen.findByRole('alert')).textContent).toContain('could not be read');
    expect(store.getState().user.user.characters).toHaveLength(1);
    expect(saveToServer).not.toHaveBeenCalled();
});
