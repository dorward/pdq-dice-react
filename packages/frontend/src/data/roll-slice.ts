import { Extra, ExtraUpdateName, ExtraUpdateValue, isExtraUpdateValue } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { selectCharacterId } from './whoami-slice';

type RollSlice = {
	description: string;
	selected: Record<string, boolean>;
	circumstance: Extra;
	usedBenny: boolean;
};

const initialRollState: RollSlice = {
	description: '',
	selected: {},
	circumstance: { id: 'circumstance', name: '', value: 0, location: '' },
	usedBenny: false,
};

const rollSlice = createSlice({
	name: 'roll',
	initialState: initialRollState,
	reducers: {
		reset: () => initialRollState,
		toggleSelected: (state, action: PayloadAction<string>) => {
			state.selected[action.payload] = !state.selected[action.payload];
			return state;
		},
		updateCircumstance: (state, action: PayloadAction<ExtraUpdateValue | ExtraUpdateName>) => {
			const extraToUpdate = state.circumstance;
			if (isExtraUpdateValue(action.payload)) extraToUpdate.value = action.payload.value as number;
			else extraToUpdate.name = action.payload.name;
			return state;
		},
		useBenny: state => {
			state.usedBenny = true;
			return state;
		},
	},
});

export const { reset, toggleSelected, updateCircumstance, useBenny } = rollSlice.actions;
export const selectSelected = (state: RootState) => state.roll.selected;
export const selectRollData = (state: RootState) => state.roll;
export const selectCircumstance = (state: RootState) => state.roll.circumstance;
export const selectBennyUse = (state: RootState) => {
	if (state.roll.usedBenny) return false; // One benny per roll
	const characterId = selectCharacterId(state);
	if (!characterId) return false; // Only characters have bennies
	const character = state.user.user.characters.find(c => c.id === characterId);
	if (!character) return false; // Character not found
	return character.bennies.current > 0; // Can't spend what you don't have
};
export default rollSlice.reducer;
