import { User } from '../types';
import axios from 'axios';

const saveToServer = async (user: User) => {
	const API_URL = process.env.API_URL;
	const url = `${API_URL}user/${user.userId}/${user.code}`;
	return axios.post(url, user);
};

export default saveToServer;
