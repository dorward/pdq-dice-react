import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { Sheet, User } from '../types';
import yaml from 'js-yaml';
import saveToServer from '../api/save-to-server';
import cleanUser from './clean-user';

type UserState = {
	user: User;
};

const initialUserState: UserState = { user: null };
const userSlice = createSlice({
	name: 'user',
	initialState: initialUserState,
	reducers: {
		set: (state, action: PayloadAction<User | Error>) => {
			console.log('reducers: set', action);
			if (action.payload instanceof Error) throw action.payload;
			const { user, cleaned } = cleanUser(action.payload);
			if (cleaned) saveToServer(user as User);
			state.user = user;
		},
		addCharacterFromYAML: (state, action: PayloadAction<string>) => {
			console.log('reducers: addCharacterFromYAML', action);
			const parsed = yaml.load(action.payload) as Sheet | null;
			if (!parsed)
				throw new Error('The YAML file could not be parsed. Something is probably wrong with the format of it.');
			const character = parsed.sheet;
			const user = state.user;
			const newUser: User = { ...user, characters: [...user.characters, character] };
			state.user = newUser;
			console.log('user state:', state.user);
			saveToServer(newUser);
		},
		applyWound: (state, action: PayloadAction<any>) => {
			console.log('reducers: applyWound', action);
			if (action.payload instanceof Error) throw action.payload;
			const { characterId, attributeId } = action.payload;
			const { user } = state;
			const character = user.characters.find(c => c.id === characterId);
			const attribute = character.qualities.find(q => q.id === attributeId);
			console.log({ character, attribute });
			attribute.wounds++;
			saveToServer(JSON.parse(JSON.stringify(user)));
		},
		unset: state => {
			state = null;
		},
	},
});

export const { set, unset, addCharacterFromYAML, applyWound } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
