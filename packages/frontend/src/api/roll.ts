import store from '../data/redux-store';
import axios from 'axios';
import { setResult } from '../data/results-slice';

const getBase = () => {
	const API_URL = process.env.API_URL;
	const { whoami } = store.getState();
	const url = `${API_URL}roll/${whoami.userId}/${whoami.code}/`;
	return url;
};

export const d6 = async () => {
	const url = `${getBase()}d6`;
	const response = await axios.post(url);
	const result = response.data.result;
	store.dispatch(setResult(result));
	return result;
};
