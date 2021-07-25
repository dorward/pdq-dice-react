import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';

type RollSlice = {
	description: string;
	selected: Record<string, boolean>;
};

const initialRollState: RollSlice = {
	description: '',
	selected: {},
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
	},
});

export const { reset, toggleSelected } = rollSlice.actions;
export const selectSelected = (state: RootState) => state.roll.selected;
export const selectRollData = (state: RootState) => state.roll;
export default rollSlice.reducer;
