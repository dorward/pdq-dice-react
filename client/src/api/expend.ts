import store from '../data/redux-store';
import { selectCharacterId, selectWhoami } from '../data/whoami-slice';
import axios from 'axios';

const getBase = () => {
	const API_URL = process.env.API_URL;
	const whoami = selectWhoami(store.getState());
	const characterId = selectCharacterId(store.getState());

	const url = `${API_URL}expend/${whoami.userId}/${whoami.code}/`;
	const auth = { characterId };
	return { auth, url };
};

export const expend = async (extraName: string) => {
	const { auth, url } = getBase();
	const data = {
		...auth,
		extraName,
	};
	const response = await axios.post(url, data);
	const result = response.data.result;
	return result;
};
