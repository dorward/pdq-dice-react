import { User } from '../types';
import axios from 'axios';

const saveToServer = async (user: User) => {
    console.log({user})
    const API_URL = process.env.API_URL;
    const url = `${API_URL}user/${user.userId}/${user.code}`;
    const response = await axios.post(url, user)
    console.log({response});

};

export default saveToServer;