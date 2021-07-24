import store from '../data/redux-store';
import axios from 'axios';
import { setResult, markLoading } from '../data/results-slice';
import { selectWhoami, selectCharacterId } from '../data/whoami-slice';
import { selectCharacter } from '../data/user-slice';
import { SkillCheckRequestBody, SelectedAttributes } from '../types';
import { attributeValues } from '../consts';

const getBase = () => {
	const API_URL = process.env.API_URL;
	const whoami = selectWhoami(store.getState());
	const characterId = selectCharacterId(store.getState());
	const url = `${API_URL}roll/${whoami.userId}/${whoami.code}/`;
	const auth = { characterId };
	return { auth, url };
};

type D6Params = {
	high?: boolean;
};

export const d6 = async ({ high }: D6Params) => {
	store.dispatch(markLoading());
	const { auth, url } = getBase();
	const data = {
		...auth,
		dice: '1d6',
		high,
	};
	const response = await axios.post(url, data);
	const result = response.data.result;
	store.dispatch(setResult(response.data));
	return result;
};

type SkillCheckParams = {
	selected: SelectedAttributes;
	description: string;
};

export const skillCheck = async ({ selected, description }: SkillCheckParams) => {
	console.log('Skill check', { selected, description });
	store.dispatch(markLoading());
	const character = selectCharacter(store.getState());
	const bonuses = [...character.qualities, ...character.powers]
		.filter(attribute => selected[attribute.id])
		.map(attribute => {
			const value =
				attributeValues[attributeValues.findIndex(value => value[0] === attribute.value) + (attribute.wounds || 0)][1];
			return {
				name: attribute.name,
				value,
			};
		});
	const { auth, url } = getBase();
	const data: SkillCheckRequestBody = {
		...auth,
		dice: '2d6',
		bonuses,
		description,
	};
	console.log(data);
	const response = await axios.post(url, data);
	const result = response.data.result;
	store.dispatch(setResult(response.data));
	return result;
};
