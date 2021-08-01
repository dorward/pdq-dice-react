// import { SkillCheckRequestBody } from '../types';
// import { attributeValues } from '../consts';
// import { markLoading, setResult } from '../data/results-slice';
// import { selectCharacter } from '../data/user-slice';
import { selectCharacterId, selectWhoami } from '../data/whoami-slice';
import axios from 'axios';

import store from '../data/redux-store';

const getBase = () => {
	const API_URL = process.env.API_URL;
	const whoami = selectWhoami(store.getState());
	const characterId = selectCharacterId(store.getState());
	const url = `${API_URL}user/${whoami.userId}/${whoami.code}/avatar`;
	const auth = { characterId };
	return { auth, url };
};

type Props = {
	image: string;
};

const updateAvatar = async ({ image }: Props) => {
	const { auth, url } = getBase();
	const data = {
		...auth,
		image,
	};
	console.log('data', data);
	const response = await axios.post(url, data);
	console.log(response.data);
	// const { selected, description, circumstance } = store.getState().roll;
	// store.dispatch(markLoading());
	// const character = selectCharacter(store.getState());
	// const qualityBonuses = [...character.qualities, ...character.powers]
	// 	.filter(attribute => selected[attribute.id])
	// 	.map(attribute => {
	// 		const value =
	// 			attributeValues[attributeValues.findIndex(value => value[0] === attribute.value) + (attribute.wounds || 0)][1];
	// 		return {
	// 			name: attribute.name,
	// 			value,
	// 		};
	// 	});
	// const extraBonuses = character.extras
	// 	.filter(extra => selected[extra.id])
	// 	.map(extra => ({
	// 		name: extra.name,
	// 		value: extra.value,
	// 	}));
	// const circumstanceBonus = circumstance.value ? [{ name: circumstance.name, value: circumstance.value }] : [];
	// const bonuses = [...qualityBonuses, ...extraBonuses, ...circumstanceBonus];
	// const { auth, url } = getBase();
	// const data: SkillCheckRequestBody = {
	// 	...auth,
	// 	dice: '2d6',
	// 	bonuses,
	// 	description,
	// 	rollType: 'Skill Check',
	// };
	// const response = await axios.post(url, data);
	// const result = response.data.result;
	// store.dispatch(setResult(response.data));
	// return result;
};

export default updateAvatar;
