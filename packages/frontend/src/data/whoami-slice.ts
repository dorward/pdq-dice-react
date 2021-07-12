import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';

type WhoamiState = {
	userId?: string;
	code?: string;
	characterId?: string;
};

type UserCreds = {
	userId: string;
	code: string;
};

const initialWhoamiState: WhoamiState = {};

const WhoamiSlice = createSlice({
	name: 'Whoami',
	initialState: initialWhoamiState,
	reducers: {
		setUserCreds: (state: WhoamiState, action: PayloadAction<UserCreds>) => {
			state.userId = action.payload.userId;
			state.code = action.payload.code;
		},
		setCharacterId: (state: WhoamiState, action: PayloadAction<string>) => {
			state.characterId = action.payload;
		},
	},
});

export const { setUserCreds, setCharacterId } = WhoamiSlice.actions;
export const selectWhoami = (state: RootState) => state.whoami;
export default WhoamiSlice.reducer;
