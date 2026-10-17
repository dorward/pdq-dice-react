// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Expend from './expend';
import { spendInventoryItem } from '../../data/user-slice';

const mocks = vi.hoisted(() => ({ expend: vi.fn(), dispatch: vi.fn(), characterId: 'first' }));
vi.mock('../../api/expend', () => ({ expend: mocks.expend }));
vi.mock('react-redux', () => ({
    useDispatch: () => mocks.dispatch,
    useSelector: () => mocks.characterId,
}));
beforeEach(() => {
    vi.resetAllMocks();
    mocks.characterId = 'first';
});
afterEach(cleanup);
const item = <Expend extraId="potion" extraName="Potion" />;
const click = () => fireEvent.click(screen.getByRole('button', { name: 'Expend one Potion' }));

test.each(['Network failure', 'Request failed with status code 500'])(
    'failed requests preserve inventory and permit retry: %s',
    async (message) => {
        let fail!: (error: Error) => void;
        mocks.expend.mockImplementationOnce(
            () =>
                new Promise((_resolve, reject) => {
                    fail = reject;
                }),
        );
        render(item);
        click();
        expect(mocks.dispatch).not.toHaveBeenCalled();
        click();
        expect(mocks.expend).toHaveBeenCalledExactlyOnceWith('Potion');
        fail(new Error(message));
        expect((await screen.findByRole('alert')).textContent).toContain(
            'Your inventory has not been consumed',
        );
        expect(mocks.dispatch).not.toHaveBeenCalled();
        mocks.expend.mockResolvedValueOnce(undefined);
        click();
        await waitFor(() =>
            expect(mocks.dispatch).toHaveBeenCalledExactlyOnceWith(
                spendInventoryItem({ characterId: 'first', extraId: 'potion' }),
            ),
        );
        expect(screen.queryByRole('alert')).toBeNull();
    },
);

test('successful pending requests expend from the original character only once', async () => {
    let finish!: () => void;
    mocks.expend.mockImplementationOnce(
        () =>
            new Promise<void>((resolve) => {
                finish = resolve;
            }),
    );
    const view = render(item);
    click();
    expect(mocks.dispatch).not.toHaveBeenCalled();
    mocks.characterId = 'second';
    view.rerender(<Expend extraId="other" extraName="Other" />);
    finish();
    await waitFor(() =>
        expect(mocks.dispatch).toHaveBeenCalledExactlyOnceWith(
            spendInventoryItem({ characterId: 'first', extraId: 'potion' }),
        ),
    );
});
