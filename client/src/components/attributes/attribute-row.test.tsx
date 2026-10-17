// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import roll, { toggleSelected } from '../../data/roll-slice';
import type { Attribute, Character } from '../../types';
import AttributeRow from './attribute-row';

afterEach(cleanup);
const character: Character = {
    id: 'character',
    name: 'Character',
    player: '',
    motivation: '',
    origin: '',
    codeName: '',
    qualities: [],
    powers: [],
    extras: [],
    inventory: [],
    bennies: { current: 3, max: '3' },
};
const attribute: Attribute = { id: 'skill', name: 'Skill', value: 'PR', wounds: 0 };

test('reaching GONE deselects the quality and disables its checkbox; healing does not reselect it', () => {
    const store = configureStore({ reducer: { roll } });
    store.dispatch(toggleSelected(attribute.id));
    const row = (wounds: number) => (
        <Provider store={store}>
            <table>
                <tbody>
                    <AttributeRow
                        attribute={{ ...attribute, wounds }}
                        character={character}
                        isWoundable
                        dataSource="qualities"
                    />
                </tbody>
            </table>
        </Provider>
    );
    const view = render(row(0));
    const checkbox = () => screen.getByRole('checkbox', { name: 'Skill' }) as HTMLInputElement;
    expect(checkbox().checked).toBe(true);
    expect(checkbox().disabled).toBe(false);
    view.rerender(row(1));
    expect(checkbox().checked).toBe(false);
    expect(checkbox().disabled).toBe(true);
    expect(store.getState().roll.selected[attribute.id]).toBeFalsy();
    fireEvent.click(checkbox());
    expect(store.getState().roll.selected[attribute.id]).toBeFalsy();
    view.rerender(row(0));
    expect(checkbox().disabled).toBe(false);
    expect(checkbox().checked).toBe(false);
    fireEvent.click(checkbox());
    expect(store.getState().roll.selected[attribute.id]).toBe(true);
});

test.each([1, 2])(
    'already selected qualities at or beyond GONE are deselected (wounds=%s)',
    (wounds) => {
        const store = configureStore({ reducer: { roll } });
        store.dispatch(toggleSelected(attribute.id));
        render(
            <Provider store={store}>
                <table>
                    <tbody>
                        <AttributeRow
                            attribute={{ ...attribute, wounds }}
                            character={character}
                            isWoundable
                            dataSource="qualities"
                        />
                    </tbody>
                </table>
            </Provider>,
        );
        const checkbox = screen.getByRole('checkbox', { name: 'Skill' }) as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
        expect(checkbox.checked).toBe(false);
        expect(store.getState().roll.selected[attribute.id]).toBeFalsy();
    },
);
