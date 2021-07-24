import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { Sheet, User } from '../types';
import yaml from 'js-yaml';
import saveToServer from '../api/save-to-server';
import cleanUser from './clean-user';
import { Character } from '../types';

type UserState = {
	user: User;
};

const initialUserState: UserState = { user: null };
const userSlice = createSlice({
	name: 'user',
	initialState: initialUserState,
	reducers: {
		set: (state, action: PayloadAction<User | Error>) => {
			if (action.payload instanceof Error) throw action.payload;
			state.user = cleanUser(action.payload);
		},
		addCharacterFromYAML: (state, action: PayloadAction<string>) => {
			const parsed = yaml.load(action.payload) as Sheet | null;
			if (!parsed)
				throw new Error('The YAML file could not be parsed. Something is probably wrong with the format of it.');
			const character = parsed.sheet;
			const user = state.user;
			const newUser: User = { ...user, characters: [...user.characters, character] };
			state.user = newUser;
			saveToServer(newUser);
		},
		updateCharacter: (state, action: PayloadAction<Character>) => {
			const characterId = action.payload.id;
			const characterIndex = state.user.characters.findIndex(character => character.id === characterId);
			console.log({ characterId, characterIndex });
			state.user.characters.splice(characterIndex, 1, action.payload);
			saveToServer(state.user);
			return state;
		},
		applyWound: (state, action: PayloadAction<any>) => {
			if (action.payload instanceof Error) throw action.payload;
			const { characterId, attributeId } = action.payload;
			const { user } = state;
			const character = user.characters.find(c => c.id === characterId);
			const attribute = character.qualities.find(q => q.id === attributeId);
			attribute.wounds++;
			saveToServer(JSON.parse(JSON.stringify(user)));
		},
		healWound: (state, action: PayloadAction<any>) => {
			if (action.payload instanceof Error) throw action.payload;
			const { characterId, attributeId } = action.payload;
			const { user } = state;
			const character = user.characters.find(c => c.id === characterId);
			const attribute = character.qualities.find(q => q.id === attributeId);
			attribute.wounds--;
			saveToServer(JSON.parse(JSON.stringify(user)));
		},
		unset: state => {
			state = null;
		},
	},
});

export const { set, unset, addCharacterFromYAML, applyWound, healWound, updateCharacter } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectCharacter = (state: RootState) => {
	const id = state.whoami.characterId;
	const character = state.user.user.characters.find(c => c.id === id);
	return character;
};
export default userSlice.reducer;
