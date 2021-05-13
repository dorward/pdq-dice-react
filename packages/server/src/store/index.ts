import { Store, User, Character } from '../types';
import { addOrUpdateUser } from './db';

const characters: Character[] = [];
const store: Store = {};

const publicChannel = (user: User): User => {
	const publicUser = { ...user };
	delete publicUser.channel;
	return publicUser;
};

const thingy = {
	addOrUpdateUser: async (user: Omit<User, 'characters'>): Promise<User> => {
		const { userId, code } = user;
		const oldUser: Partial<User> = store[userId] || {};
		const newUser = { characters: [...characters], ...oldUser, ...user };
		store[userId] = newUser;
		const result = await addOrUpdateUser(userId, code, newUser);
		console.log({ result });
		console.log('Storing new user', newUser, userId);
		return newUser;
	},
	getUser: (code: string): User | undefined => {
		console.log('getUser', code, store);
		const user = Object.values(store).find(user => user.code === code);
		if (!user) return undefined;
		const publicUser = publicChannel(user);
		return publicUser;
	},
};

export default thingy;
