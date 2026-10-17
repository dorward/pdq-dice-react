import { describe, it, expect } from 'vitest';
import reducer, { moveSomeExtra } from './edit-mode-slice';
import { Character, Extra, ExtraContainer } from '../types';
import { SelectedExtra } from './edit-mode-slice';
import { v4 as uuidv4 } from 'uuid';

const INF = '∞';

const defaultState: Character & SelectedExtra = {
    id: 'UID0',
    name: 'Test Name',
    avatar: null,
    extras: [],
    inventory: [],
    origin: 'Test Origin',
    player: 'Test Player',
    powers: [],
    bennies: {
        max: '3',
        current: 3,
    },
    codeName: 'Test Code Name',
    qualities: [],
    background: 'Test background',
    motivation: 'Test motivation',
};

const defaultExtra: Extra = {
    id: 'UID1',
    name: 'Sample Item',
    count: 1,
    value: 0,
    location: '',
};

const createExtra = (defaultValues?: Partial<Extra>): Extra => ({
    ...defaultExtra,
    id: uuidv4(),
    ...defaultValues,
});

describe('Edit Mode Slice', () => {
    it('should pass a POC test', () => {
        expect(true).toBeTruthy();
    });
    describe('moveSomeExtra', () => {
        describe('moving containers', () => {
            const createContainer = (id: string, location: string): ExtraContainer => ({
                id,
                name: 'Box',
                location,
                count: null,
                value: null,
                capacity: 10,
                isExpanded: true,
            });

            it.each([false, true])(
                'preserves a container and its descendants when the destination has a matching container: %s',
                (hasMatchingContainer) => {
                    const home = { ...createContainer('home', ''), name: 'Home' };
                    const source = createContainer('source', '');
                    const destination = createContainer('destination', home.id);
                    const nested = createContainer('nested', source.id);
                    const child = createExtra({ location: nested.id });
                    const existingChild = createExtra({ location: destination.id });
                    const inventory = [home, source, nested, child];
                    if (hasMatchingContainer) inventory.push(destination, existingChild);
                    const state = { ...defaultState, inventory };

                    const updatedState = reducer(
                        state,
                        moveSomeExtra({ id: source.id, count: null, location: home.id }),
                    );

                    expect(updatedState.inventory).toEqual(
                        inventory.map((item) =>
                            item.id === source.id ? { ...source, location: home.id } : item,
                        ),
                    );
                    expect(source.location).toBe('');
                },
            );

            it('keeps a container unchanged when moved to its current location', () => {
                const source = createContainer('source', '');
                const child = createExtra({ location: source.id });
                const state = { ...defaultState, inventory: [source, child] };

                expect(
                    reducer(state, moveSomeExtra({ id: source.id, count: null, location: '' })),
                ).toEqual(state);
            });
        });

        describe('when there are no items in the target location', () => {
            describe('and you move all the items', () => {
                describe('from location null to location B', () => {
                    const thisTest = (count: Extra['count']) => {
                        const item = createExtra({ count });
                        const state = {
                            ...defaultState,
                            inventory: [...defaultState.inventory, item],
                        };

                        const updatedState = reducer(
                            state,
                            moveSomeExtra({ id: item.id, count, location: 'B' }),
                        );

                        expect(updatedState.inventory.length).toBe(1);
                        expect(updatedState.inventory[0]).toEqual({ ...item, location: 'B' });
                    };

                    it('should move an infinite item', () => thisTest(INF));
                    it('should move 1 item', () => thisTest(1));
                    it('should move 5 items', () => thisTest(5));
                });
                describe('from location A to location B', () => {
                    const thisTest = (count: Extra['count']) => {
                        const item = createExtra({ count, location: 'A' });
                        const state = {
                            ...defaultState,
                            inventory: [...defaultState.inventory, item],
                        };

                        const updatedState = reducer(
                            state,
                            moveSomeExtra({ id: item.id, count, location: 'B' }),
                        );

                        expect(updatedState.inventory.length).toBe(1);
                        expect(updatedState.inventory[0]).toEqual({ ...item, location: 'B' });
                    };

                    it('should move an infinite item', () => thisTest(INF));
                    it('should move 1 item', () => thisTest(1));
                    it('should move 5 items', () => thisTest(5));
                });
            });
        });

        describe('and you move some of the items to a location does not have items already', () => {
            const getResult = (fromCount: Extra['count'], count: Extra['count']) => {
                const state = {
                    ...defaultState,
                    inventory: [...defaultState.inventory],
                };

                const from = createExtra({ count: fromCount, location: 'A' });
                state.inventory.push(from);

                return {
                    inventory: reducer(
                        state,
                        moveSomeExtra({ id: from.id, count, location: 'B' }),
                    ).inventory,
                    from,
                };
            };

            it('should move 1 of an infinite item', () => {
                const { inventory, from } = getResult(INF, 1);
                expect(inventory.length).toBe(2);
                const foundFrom = inventory.find((extra) => extra.id === from.id);
                const foundTo = inventory.find((extra) => extra.id !== from.id);
                expect(foundFrom).toBeTruthy();
                expect(foundTo).toBeTruthy();
                expect(foundFrom.location).toBe('A');
                expect(foundTo.location).toBe('B');
                expect(foundFrom.count).toBe(INF);
                expect(foundTo.count).toBe(1);
            });

            it('should move 1 of 5 items item', () => {
                const { inventory, from } = getResult(5, 1);
                expect(inventory.length).toBe(2);
                const foundFrom = inventory.find((extra) => extra.id === from.id);
                const foundTo = inventory.find((extra) => extra.id !== from.id);
                expect(foundFrom).toBeTruthy();
                expect(foundTo).toBeTruthy();
                expect(foundFrom.location).toBe('A');
                expect(foundTo.location).toBe('B');
                expect(foundFrom.count).toBe(4);
                expect(foundTo.count).toBe(1);
            });

            it('should move 5 of 5 items item', () => {
                const { inventory, from } = getResult(5, 5);
                expect(inventory.length).toBe(1);
                const foundFrom = inventory.find((extra) => extra.id === from.id);
                const foundTo = inventory.find((extra) => extra.id !== from.id);
                expect(foundFrom).toBeTruthy();
                expect(foundTo).toBeFalsy();
                expect(foundFrom.location).toBe('B');
                expect(foundFrom.count).toBe(5);
            });
        });

        describe('and you move some of the items to a location which already has items', () => {
            const getResult = (
                fromCount: Extra['count'],
                toCount: Extra['count'],
                count: Extra['count'],
            ) => {
                const state = {
                    ...defaultState,
                    inventory: [...defaultState.inventory],
                };

                const from = createExtra({ count: fromCount, location: 'A' });
                state.inventory.push(from);

                const to =
                    toCount !== 0 ? createExtra({ count: toCount, location: 'B' }) : null;

                if (to) state.inventory.push(to);

                return {
                    inventory: reducer(
                        state,
                        moveSomeExtra({ id: from.id, count, location: 'B' }),
                    ).inventory,
                    from,
                    to,
                };
            };

            it('should move all of an infinite item to a location with 1', () => {
                const { inventory, to } = getResult(INF, 1, INF);
                expect(inventory.length).toBe(1);
                expect(inventory[0].id).toEqual(to?.id);
                expect(inventory[0].count).toEqual(INF);
            });

            it('should move 1 of an infinite item to a location with 1', () => {
                const { inventory, from } = getResult(INF, 1, 1);
                expect(inventory.length).toBe(2);
                const foundFrom = inventory.find((extra) => extra.id === from.id);
                const foundTo = inventory.find((extra) => extra.id !== from.id);
                expect(foundFrom).toBeTruthy();
                expect(foundTo).toBeTruthy();
                expect(foundFrom.location).toBe('A');
                expect(foundTo.location).toBe('B');
                expect(foundFrom.count).toBe(INF);
                expect(foundTo.count).toBe(2);
            });

            it('should move 10 of an infinite item to a location with 1', () => {
                const { inventory, from } = getResult(INF, 1, 10);
                expect(inventory.length).toBe(2);
                const foundFrom = inventory.find((extra) => extra.id === from.id);
                const foundTo = inventory.find((extra) => extra.id !== from.id);
                expect(foundFrom).toBeTruthy();
                expect(foundTo).toBeTruthy();
                expect(foundFrom.location).toBe('A');
                expect(foundTo.location).toBe('B');
                expect(foundFrom.count).toBe(INF);
                expect(foundTo.count).toBe(11);
            });

            it('should move all of 5 items to a location with 1', () => {
                const { inventory, to } = getResult(5, 1, 5);
                expect(inventory.length).toBe(1);
                expect(inventory[0].id).toEqual(to?.id);
                expect(inventory[0].count).toEqual(6);
            });
            it('should move 2 of 5 items to a location with 1', () => {
                const { inventory, to, from } = getResult(5, 1, 2);
                expect(inventory.length).toBe(2);
                const foundFrom = inventory.find((extra) => extra.id === from.id);
                const foundTo = inventory.find((extra) => extra.id === to?.id);
                expect(foundFrom).toBeTruthy();
                expect(foundTo).toBeTruthy();
                expect(foundFrom.location).toBe('A');
                expect(foundTo.location).toBe('B');
                expect(foundFrom.count).toBe(3);
                expect(foundTo.count).toBe(3);
            });
        });
    });
});
