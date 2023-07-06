import { E_BAD_CODE, E_NOT_FOUND, E_UNEXPECTED_ERROR } from '../errors';
import { User } from '../types';
import { getUserById } from './getUserById';

export const getUserByCodeAndId = async (
    code: User['code'],
    userId: User['userId'],
): Promise<User | typeof E_NOT_FOUND | typeof E_BAD_CODE | typeof E_UNEXPECTED_ERROR> => {
    const user = await getUserById(userId);
    if (user === E_UNEXPECTED_ERROR) return E_UNEXPECTED_ERROR;
    if (user === E_NOT_FOUND) return E_NOT_FOUND;
    if (code !== user.code) return E_BAD_CODE;
    return user;
};
