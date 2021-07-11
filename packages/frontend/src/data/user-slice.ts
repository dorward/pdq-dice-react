import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { Sheet, PossibleUser, User } from '../types';
import yaml from 'js-yaml';
import saveToServer from '../api/save-to-server';

type UserState = {
	user: PossibleUser;
};

const guardUser = (user: PossibleUser): User => {
	if (!user) throw new Error('No user');
	if (user instanceof Error) throw user;
	return user;
};

const initialUserState: UserState = { user: null };
const userSlice = createSlice({
	name: 'user',
	initialState: initialUserState,
	reducers: {
		set: (state, action: PayloadAction<User | Error>) => {
			console.log('reducers: set', action);
			state.user = action.payload;
		},
		addCharacterFromYAML: (state, action: PayloadAction<string>) => {
			console.log('reducers: addCharacterFromYAML', action);
			const parsed = yaml.load(action.payload) as Sheet | null;
			if (!parsed)
				throw new Error('The YAML file could not be parsed. Something is probably wrong with the format of it.');
			const character = parsed.sheet;
			const user = guardUser(state.user);
			const newUser: User = { ...user, characters: [...user.characters, character] };
			state.user = newUser;
			console.log('user state:', state.user);
			saveToServer(newUser);
		},
		applyWound: (state, action: PayloadAction<string>) => {
			console.log('reducers: applyWound', action);
			state.user = { ...state.user };
		},
		unset: state => {
			state = null;
		},
	},
});

export const { set, unset, addCharacterFromYAML, applyWound } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
