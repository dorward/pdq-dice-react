import { Response } from 'express';

import { E_BAD_CODE, E_NOT_FOUND, E_UNEXPECTED_ERROR } from '../errors';
import { getUserByCodeAndId } from '../model/getUserByCodeAndId';
import { User } from '../types';

const responses: Record<string, number> = {
    [E_NOT_FOUND]: 400,
    [E_BAD_CODE]: 401,
    [E_UNEXPECTED_ERROR]: 500,
};

const authHelper = async (code: string, userId: string, res: Response) => {
    const user = await getUserByCodeAndId(code, userId);
    const statusCode = responses[`${user}`];
    if (statusCode) {
        res.sendStatus(statusCode);
        return null;
    }
    return user as User;
};

export default authHelper;
