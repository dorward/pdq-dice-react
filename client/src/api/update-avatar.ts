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
	const response = await axios.post(url, data);
	return response.data.url;
};

export default updateAvatar;
