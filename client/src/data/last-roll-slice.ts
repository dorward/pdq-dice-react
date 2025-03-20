import type { SkillCheckRequestBody } from '../types';
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
export default lastRollSlice.reducer;
