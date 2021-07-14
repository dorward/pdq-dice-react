import store from '../data/redux-store';
import axios from 'axios';
import { setResult, markLoading } from '../data/results-slice';

const getBase = () => {
	const API_URL = process.env.API_URL;
	const { whoami } = store.getState();
	const url = `${API_URL}roll/${whoami.userId}/${whoami.code}/`;
	return url;
};

type D6Params = {
	high?: boolean;
};

export const d6 = async ({ high }: D6Params) => {
	store.dispatch(markLoading());
	const url = getBase();
	const data = {
		dice: '1d6',
		high,
	};
	const response = await axios.post(url, data);
	const result = response.data.result;
	store.dispatch(setResult(response.data));
	return result;
};
