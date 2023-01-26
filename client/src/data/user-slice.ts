import { Character, Sheet, User } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { selectCharacterId } from './whoami-slice';
import blankCharacter from './blankCharacter';
import cleanUser, { cleanCharacter } from './clean-user';
import saveToServer from '../api/save-to-server';
import yaml from 'js-yaml';

type UserState = {
	user: User;
	error: string;
};

type AttributePath = { characterId: string; attributeId: string };
type ExtraPath = { characterId: string; extraId: string };

const initialUserState: UserState = { user: null, error: null };
const userSlice = createSlice({
	name: 'user',
	initialState: initialUserState,
	reducers: {
		set: (state, action: PayloadAction<User | Error>) => {
			if (action.payload instanceof Error) throw action.payload;
			state.user = cleanUser(action.payload);
			state.error = null;
		},
		setUserError: (state, action: PayloadAction<string>) => {
			state.user = null;
			state.error = action.payload;
		},
		addCharacterFromYAML: (state, action: PayloadAction<string>) => {
			const parsed = yaml.load(action.payload) as Sheet | Character | null;
			if (!parsed)
				throw new Error('The YAML file could not be parsed. Something is probably wrong with the format of it.');
			const character = 'sheet' in parsed ? parsed.sheet : parsed;
			cleanCharacter(character);
			const user = state.user;
			const newUser: User = { ...user, characters: [...user.characters, character] };
			saveToServer(JSON.parse(JSON.stringify(newUser)));
			state.user = newUser;
		},
		addCharacterFromScratch: (state, action: PayloadAction<string>) => {
			state.user.characters = [...state.user.characters, blankCharacter(action.payload)];
			saveToServer(JSON.parse(JSON.stringify(state.user)));
			return state;
		},
		updateCharacter: (state, action: PayloadAction<Character>) => {
			const characterId = action.payload.id;
			const characterIndex = state.user.characters.findIndex(character => character.id === characterId);
			state.user.characters.splice(characterIndex, 1, action.payload);
			saveToServer(JSON.parse(JSON.stringify(state.user)));
			return state;
		},
		toggleCharacterVisibility: (state, action: PayloadAction<string>) => {
			const characterId = action.payload;
			const character = state.user.characters.find(c => c.id === characterId);
			character.hidden = !character.hidden;
			return state;
		},
		deleteCharacter: (state, action: PayloadAction<string>) => {
			const characterId = action.payload;
			const characterIndex = state.user.characters.findIndex(c => c.id === characterId);
			state.user.characters.splice(characterIndex, 1);
			saveToServer(JSON.parse(JSON.stringify(state.user)));
			return state;
		},
		applyWound: (state, action: PayloadAction<AttributePath>) => {
			if (action.payload instanceof Error) throw action.payload;
			const { characterId, attributeId } = action.payload;
			const { user } = state;
			const character = user.characters.find(c => c.id === characterId);
			const attribute = character.qualities.find(q => q.id === attributeId);
			attribute.wounds++;
			saveToServer(JSON.parse(JSON.stringify(user)));
		},
		healWound: (state, action: PayloadAction<AttributePath>) => {
			if (action.payload instanceof Error) throw action.payload;
			const { characterId, attributeId } = action.payload;
			const { user } = state;
			const character = user.characters.find(c => c.id === characterId);
			const attribute = character.qualities.find(q => q.id === attributeId);
			attribute.wounds--;
			saveToServer(JSON.parse(JSON.stringify(user)));
		},
		spendBenny: (state, action: PayloadAction<string>) => {
			const { user } = state;
			const characterId = action.payload;
			const character = user.characters.find(c => c.id === characterId);
			character.bennies.current--;
			saveToServer(JSON.parse(JSON.stringify(user)));
			return state;
		},
		spendExtra: (state, action: PayloadAction<ExtraPath>) => {
			const { user } = state;
			const { characterId, extraId } = action.payload;
			const character = user.characters.find(c => c.id === characterId);
			const extra = character.extras.find(extra => extra.id === extraId);
			if (extra && extra.count !== '∞' && extra.count > 0) {
				extra.count = extra.count - 1;
				saveToServer(JSON.parse(JSON.stringify(user)));
			}
			return state;
		},
		unset: () => null,
	},
});

export const {
	addCharacterFromScratch,
	addCharacterFromYAML,
	applyWound,
	deleteCharacter,
	healWound,
	set,
	setUserError,
	spendBenny,
	spendExtra,
	toggleCharacterVisibility,
	unset,
	updateCharacter,
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserError = (state: RootState) => state.user.error;
export const selectCharacters = (state: RootState): Character[] => state.user?.user?.characters ?? [];
export const selectCharacter = (state: RootState) => {
	const id = state.whoami.characterId || state.user?.user?.characters?.[0]?.id;
	const character = state.user.user.characters.find(c => c.id === id);
	return character;
};
export const selectBennies = (state: RootState) => {
	const characterId = selectCharacterId(state);
	if (!characterId) return null;
	const character = state.user.user.characters.find(c => c.id === characterId);
	if (!character) return null;
	return character.bennies;
};
export default userSlice.reducer;
