import { User, Character } from '../types';
import { addOrUpdateUser, getUserById, getUserByCode } from './db';

const characters: Character[] = [];

const thingy = {
	addOrUpdateUser: async (user: Omit<User, 'characters'>): Promise<User> => {
		const { userId, code } = user;
		const oldUser: Partial<User> = (await getUserById(userId)) || {};
		const newUser = { characters: [...characters], ...oldUser, ...user };
		await addOrUpdateUser(userId, code, newUser);
		return newUser;
	},
	getUser: async (code: string): Promise<User | undefined> => {
		const user = await getUserByCode(code);
		if (!user) return undefined;
		return user;
	},
};

export default thingy;
