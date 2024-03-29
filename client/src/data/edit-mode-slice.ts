import { AttributeUpdate, Character, ExtraUpdate, SelectExtra, ExtraPartialMove, Extra } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import {
	isAttributeUpdateValue,
	isAttributeUpdateNotes,
	isExtraUpdateLocation,
	isExtraUpdateValue,
	isExtraUpdateCount,
} from '../types/guard';
import { mutateLocation, mutateName, mutateValue, mutateCount, mutateNotes } from './edit-mode-helpers';
import { v4 as uuidv4 } from 'uuid';

export type SelectedExtra = {
	selectedExtraId?: string;
};

const INF = '∞';

type EditModeState = null | (Character & SelectedExtra);

const initialEditModeState: EditModeState = null;

const createExtra = () => ({
	id: uuidv4(),
	name: '__New extra',
	value: 0,
	location: '',
});

const EditModeSlice = createSlice({
	name: 'EditMode',
	initialState: initialEditModeState,
	reducers: {
		editCharacter: (state: EditModeState, action: PayloadAction<Character>) => action.payload,
		updateAttribute: (state: EditModeState, action: PayloadAction<AttributeUpdate>) => {
			if (isAttributeUpdateValue(action.payload)) {
				if (action.payload.value === 'DEL') {
					state.qualities = state.qualities.filter(q => q.id !== action.payload.id);
					state.powers = state.powers.filter(q => q.id !== action.payload.id);
					return state;
				}
				state.qualities = mutateValue(state.qualities, action.payload.id, action.payload.value);
				state.powers = mutateValue(state.powers, action.payload.id, action.payload.value);
			} else if (isAttributeUpdateNotes(action.payload)) {
				state.qualities = mutateNotes(state.qualities, action.payload.id, action.payload.notes);
				state.powers = mutateNotes(state.powers, action.payload.id, action.payload.notes);
			} else {
				state.qualities = mutateName(state.qualities, action.payload.id, action.payload.name);
				state.powers = mutateName(state.powers, action.payload.id, action.payload.name);
			}
			return state;
		},
		addAttribute: (state: EditModeState, action: PayloadAction<'quality' | 'power'>) => {
			const prop = action.payload === 'quality' ? 'qualities' : 'powers';
			state[prop] = [
				...state[prop],
				{
					id: uuidv4(),
					name: `New ${action.payload}`,
					value: 'AVG',
					wounds: 0,
				},
			];
			return state;
		},
		updateExtra: (state: EditModeState, action: PayloadAction<ExtraUpdate>) => {
			if (isExtraUpdateValue(action.payload)) {
				const { value } = action.payload;
				if (value === 'DEL') {
					state.extras = state.extras.filter(q => q.id !== action.payload.id);
				} else {
					state.extras = mutateValue(state.extras, action.payload.id, action.payload.value);
				}
			} else if (isExtraUpdateLocation(action.payload)) {
				state.extras = mutateLocation(state.extras, action.payload.id, action.payload.location);
			} else if (isExtraUpdateCount(action.payload)) {
				state.extras = mutateCount(state.extras, action.payload.id, action.payload.count);
			} else {
				state.extras = mutateName(state.extras, action.payload.id, action.payload.name);
			}
			return state;
		},
		moveSomeExtra: (state: EditModeState, action: PayloadAction<ExtraPartialMove>) => {
			// Find the elements we are dealing with

			const fromIndex = state.extras.findIndex(extra => extra.id === action.payload.id);
			const from = state.extras[fromIndex];

			const toIndex = state.extras.findIndex(
				extra => extra.name === from.name && extra.location === action.payload.location
			);
			const to = state.extras[toIndex] ?? { ...from, id: uuidv4(), location: action.payload.location, count: 0 };

			const deleteExtra = (target: Extra) => {
				state.extras = state.extras.filter(e => e.id !== target.id);
			};

			// Calculate how those two elements are going to change
			const change = action.payload.count;
			if (change === INF || change === from.count) {
				// We are moving *all* of the items in the from box
				if (toIndex === -1) {
					// This is a complete move
					from.location = action.payload.location;
				} else {
					// This is a merge
					if (change === INF) to.count = INF;
					else if (to.count !== INF) to.count = to.count + change;
					deleteExtra(from);
				}
			} else {
				// We are moving **some** of the items in the from box
				if (toIndex === -1) state.extras.push(to);
				if (to.count !== INF) to.count = to.count + change;
				if (from.count !== INF) from.count = from.count - change;
			}
			// Clean up
			[to, from].forEach(extra => {
				if (extra.count === 0) deleteExtra(extra);
			});
			return state;
		},
		promptExtraCount: (state: EditModeState, action: PayloadAction<SelectExtra>) => {
			const { id } = action.payload;
			return { ...state, selectedExtraId: id };
		},
		addExtra: (state: EditModeState) => {
			state.extras = [...state.extras, createExtra()];
			return state;
		},
		updateAvatar: (state: EditModeState, action: PayloadAction<string>) => {
			state.avatar = action.payload;
			return state;
		},
		updateName: (state: EditModeState, action: PayloadAction<string>) => {
			state.name = action.payload;
			return state;
		},
		updateCodeName: (state: EditModeState, action: PayloadAction<string>) => {
			state.codeName = action.payload;
			return state;
		},
		updateMotivation: (state: EditModeState, action: PayloadAction<string>) => {
			state.motivation = action.payload;
			return state;
		},
		updateOrigin: (state: EditModeState, action: PayloadAction<string>) => {
			state.origin = action.payload;
			return state;
		},
		updatePlayer: (state: EditModeState, action: PayloadAction<string>) => {
			state.player = action.payload;
			return state;
		},
		updateCurrentBennies: (state: EditModeState, action: PayloadAction<number>) => {
			state.bennies.current = action.payload;
			return state;
		},
		updateMaximumBennies: (state: EditModeState, action: PayloadAction<string>) => {
			state.bennies.max = action.payload;
			return state;
		},
		updateBackground: (state: EditModeState, action: PayloadAction<string>) => {
			state.background = action.payload;
			return state;
		},
		exitEditMode: () => null,
	},
});

export const {
	addAttribute,
	addExtra,
	editCharacter,
	exitEditMode,
	moveSomeExtra,
	promptExtraCount,
	updateAttribute,
	updateAvatar,
	updateBackground,
	updateCodeName,
	updateCurrentBennies,
	updateExtra,
	updateMaximumBennies,
	updateMotivation,
	updateName,
	updateOrigin,
	updatePlayer,
} = EditModeSlice.actions;
export const selectEditingCharacter = (state: RootState) => state.editMode;
export const selectLocations = (state: RootState) =>
	state.editMode.extras
		.map(extra => extra.location)
		.filter(location => location !== '')
		.filter((location, index, array) => array.indexOf(location) === index)
		.sort();
export default EditModeSlice.reducer;
