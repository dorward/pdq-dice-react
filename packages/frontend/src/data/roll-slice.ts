import { Extra, ExtraUpdate, isExtraUpdateValue } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';

type RollSlice = {
	description: string;
	selected: Record<string, boolean>;
	circumstance: Extra;
};

const initialRollState: RollSlice = {
	description: '',
	selected: {},
	circumstance: { id: 'circumstance', name: '', value: 0 },
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
		updateCircumstance: (state, action: PayloadAction<ExtraUpdate>) => {
			const extraToUpdate = state.circumstance;
			if (isExtraUpdateValue(action.payload)) extraToUpdate.value = action.payload.value;
			else extraToUpdate.name = action.payload.name;
			return state;
		},
	},
});

export const { reset, toggleSelected, updateCircumstance } = rollSlice.actions;
export const selectSelected = (state: RootState) => state.roll.selected;
export const selectRollData = (state: RootState) => state.roll;
export const selectCircumstance = (state: RootState) => state.roll.circumstance;
export default rollSlice.reducer;
