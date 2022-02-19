import { User } from '../types';
import axios from 'axios';

const saveToServer = async (user: User) => {
	const API_URL = process.env.API_URL;
	const url = `${API_URL}user/${user.userId}/${user.code}`;
	const result = await axios.post(url, user);
	if (![200, 204].includes(result.status)) {
		console.error('Error updating server');
		// TODO Track errors in the state and do some recovery based on what is actually on the server
	}
};

export default saveToServer;
