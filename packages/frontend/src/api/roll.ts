import store from '../data/redux-store';
import axios from 'axios';
import { setResult, markLoading } from '../data/results-slice';
import { selectWhoami, selectCharacterId } from '../data/whoami-slice';

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
