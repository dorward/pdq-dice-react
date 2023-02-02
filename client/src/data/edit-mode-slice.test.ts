import reducer, { moveSomeExtra } from './edit-mode-slice';
import { Character, Extra } from '../types';
import { SelectedExtra } from './edit-mode-slice';
import { v4 as uuidv4 } from 'uuid';

const INF = '∞';

const defaultState: Character & SelectedExtra = {
	id: 'UID0',
	name: 'Test Name',
	avatar: null,
	extras: [],
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

const createExtra = (defaultValues?: Partial<Extra>): Extra => ({ ...defaultExtra, id: uuidv4(), ...defaultValues });

describe('Edit Mode Slice', () => {
	it('should pass a POC test', () => {
		expect(true).toBeTruthy();
	});
	describe('moveSomeExtra', () => {
		describe('when there are no items in the target location', () => {
			describe('and you move all the items', () => {
				describe('from location null to location B', () => {
					const thisTest = (count: Extra['count']) => {
						const item = createExtra({ count });
						const state = {
							...defaultState,
							extras: [...defaultState.extras, item],
						};

						const updatedState = reducer(state, moveSomeExtra({ id: item.id, count, location: 'B' }));

						expect(updatedState.extras.length).toBe(1);
						expect(updatedState.extras[0]).toEqual({ ...item, location: 'B' });
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
							extras: [...defaultState.extras, item],
						};

						const updatedState = reducer(state, moveSomeExtra({ id: item.id, count, location: 'B' }));

						expect(updatedState.extras.length).toBe(1);
						expect(updatedState.extras[0]).toEqual({ ...item, location: 'B' });
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
					extras: [...defaultState.extras],
				};

				const from = createExtra({ count: fromCount, location: 'A' });
				state.extras.push(from);

				return {
					extras: reducer(state, moveSomeExtra({ id: from.id, count, location: 'B' })).extras,
					from,
				};
			};

			it('should move 1 of an infinite item', () => {
				const { extras, from } = getResult(INF, 1);
				expect(extras.length).toBe(2);
				const foundFrom = extras.find(extra => extra.id === from.id);
				const foundTo = extras.find(extra => extra.id !== from.id);
				expect(foundFrom).toBeTruthy();
				expect(foundTo).toBeTruthy();
				expect(foundFrom.location).toBe('A');
				expect(foundTo.location).toBe('B');
				expect(foundFrom.count).toBe(INF);
				expect(foundTo.count).toBe(1);
			});

			it('should move 1 of 5 items item', () => {
				const { extras, from } = getResult(5, 1);
				expect(extras.length).toBe(2);
				const foundFrom = extras.find(extra => extra.id === from.id);
				const foundTo = extras.find(extra => extra.id !== from.id);
				expect(foundFrom).toBeTruthy();
				expect(foundTo).toBeTruthy();
				expect(foundFrom.location).toBe('A');
				expect(foundTo.location).toBe('B');
				expect(foundFrom.count).toBe(4);
				expect(foundTo.count).toBe(1);
			});

			it('should move 5 of 5 items item', () => {
				const { extras, from } = getResult(5, 5);
				expect(extras.length).toBe(1);
				const foundFrom = extras.find(extra => extra.id === from.id);
				const foundTo = extras.find(extra => extra.id !== from.id);
				expect(foundFrom).toBeTruthy();
				expect(foundTo).toBeFalsy();
				expect(foundFrom.location).toBe('B');
				expect(foundFrom.count).toBe(5);
			});
		});

		describe('and you move some of the items to a location which already has items', () => {
			const getResult = (fromCount: Extra['count'], toCount: Extra['count'], count: Extra['count']) => {
				const state = {
					...defaultState,
					extras: [...defaultState.extras],
				};

				const from = createExtra({ count: fromCount, location: 'A' });
				state.extras.push(from);

				const to = toCount !== 0 ? createExtra({ count: toCount, location: 'B' }) : null;

				if (to) state.extras.push(to);

				return {
					extras: reducer(state, moveSomeExtra({ id: from.id, count, location: 'B' })).extras,
					from,
					to,
				};
			};

			it('should move all of an infinite item to a location with 1', () => {
				const { extras, to } = getResult(INF, 1, INF);
				expect(extras.length).toBe(1);
				expect(extras[0].id).toEqual(to.id);
				expect(extras[0].count).toEqual(INF);
			});

			it('should move 1 of an infinite item to a location with 1', () => {
				const { extras, from } = getResult(INF, 1, 1);
				expect(extras.length).toBe(2);
				const foundFrom = extras.find(extra => extra.id === from.id);
				const foundTo = extras.find(extra => extra.id !== from.id);
				expect(foundFrom).toBeTruthy();
				expect(foundTo).toBeTruthy();
				expect(foundFrom.location).toBe('A');
				expect(foundTo.location).toBe('B');
				expect(foundFrom.count).toBe(INF);
				expect(foundTo.count).toBe(2);
			});

			it('should move 10 of an infinite item to a location with 1', () => {
				const { extras, from } = getResult(INF, 1, 10);
				expect(extras.length).toBe(2);
				const foundFrom = extras.find(extra => extra.id === from.id);
				const foundTo = extras.find(extra => extra.id !== from.id);
				expect(foundFrom).toBeTruthy();
				expect(foundTo).toBeTruthy();
				expect(foundFrom.location).toBe('A');
				expect(foundTo.location).toBe('B');
				expect(foundFrom.count).toBe(INF);
				expect(foundTo.count).toBe(11);
			});

			it('should move all of 5 items to a location with 1', () => {
				const { extras, to } = getResult(5, 1, 5);
				expect(extras.length).toBe(1);
				expect(extras[0].id).toEqual(to.id);
				expect(extras[0].count).toEqual(6);
			});
			it('should move 2 of 5 items to a location with 1', () => {
				const { extras, to, from } = getResult(5, 1, 2);
				expect(extras.length).toBe(2);
				const foundFrom = extras.find(extra => extra.id === from.id);
				const foundTo = extras.find(extra => extra.id === to.id);
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
