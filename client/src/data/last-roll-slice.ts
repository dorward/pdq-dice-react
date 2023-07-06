import type { SkillCheckRequestBody } from '../types';
import { RootState } from './redux-store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type LastRollSlice = {
	roll: SkillCheckRequestBody;
};

const initialLastRollState: LastRollSlice = {
	roll: { dice: '2d6', bonuses: [], description: '', rollType: 'Skill Check' },
};

const lastRollSlice = createSlice({
	name: 'lastRoll',
	initialState: initialLastRollState,
	reducers: {
		updateLastRoll: (state, { payload }: PayloadAction<SkillCheckRequestBody>) => {
			return { roll: payload };
		},
	},
});

export const { updateLastRoll } = lastRollSlice.actions;
export const selectLastRoll = (state: RootState) => state.roll.selected;
export default lastRollSlice.reducer;
