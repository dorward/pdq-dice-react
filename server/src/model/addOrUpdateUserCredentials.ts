import { User } from '../types';
import addOrUpdateUser from './addOrUpdateUser';
import getUserById from './getUserById';

const addOrUpdateUserCredentials = async (
    user: Omit<User, 'characters'>,
    updateCode?: boolean,
): Promise<User> => {
    const { userId, code } = user;
    const queryResult = await getUserById(userId);
    const oldUser = typeof queryResult === 'string' ? {} : queryResult;
    const newUser = {
        characters: [], // oldUser will override this if this is not an existing user
        ...oldUser, // From database
        ...user, // From Discord.js
    };
    try {
        await addOrUpdateUser(userId, code, newUser, updateCode);
    } catch (e) {
        console.error('error calling addOrUpdateUser', e);
        throw e;
    }
    return newUser;
};

export default addOrUpdateUserCredentials;
