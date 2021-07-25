import { SkillCheckRequestBody } from '../types';
import { attributeValues } from '../consts';
import { markLoading, setResult } from '../data/results-slice';
import { selectCharacter } from '../data/user-slice';
import { selectCharacterId, selectWhoami } from '../data/whoami-slice';

import axios from 'axios';
import store from '../data/redux-store';

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
export const skillCheck = async () => {
	const { selected, description } = store.getState().roll;
	console.log('Skill check', { selected, description });
	store.dispatch(markLoading());
	const character = selectCharacter(store.getState());
	const qualityBonuses = [...character.qualities, ...character.powers]
		.filter(attribute => selected[attribute.id])
		.map(attribute => {
			const value =
				attributeValues[attributeValues.findIndex(value => value[0] === attribute.value) + (attribute.wounds || 0)][1];
			return {
				name: attribute.name,
				value,
			};
		});
	const extraBonuses = character.extras
		.filter(extra => selected[extra.id])
		.map(extra => ({
			name: extra.name,
			value: extra.value,
		}));

	const bonuses = [...qualityBonuses, ...extraBonuses];
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
