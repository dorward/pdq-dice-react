import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { Sheet, Character, PossibleUser, User } from '../types';
import yaml from 'js-yaml';

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
			console.log(action);
			state.user = action.payload;
		},
		addCharacterFromYAML: (state, action: PayloadAction<string>) => {
			const parsed = yaml.load(action.payload) as Sheet | null;
			if (!parsed)
				throw new Error('The YAML file could not be parsed. Something is probably wrong with the format of it.');
			const character = parsed.sheet;
			const user = guardUser(state.user);
			const newUser: User = { ...user, characters: [...user.characters, character] };
			state.user = newUser;
		},
		unset: state => {
			state = null;
		},
	},
});

export const { set, unset, addCharacterFromYAML } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
