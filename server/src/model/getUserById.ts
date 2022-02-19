import pool from '../dbConfig/dbConnector';
import { E_NOT_FOUND, E_UNEXPECTED_ERROR } from '../errors';
import { User } from '../types';

export const getUserById = async (
    userId: User['userId'],
): Promise<User | typeof E_UNEXPECTED_ERROR | typeof E_NOT_FOUND> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT data FROM user_data WHERE userId=$1';
        const result = await client.query(sql, [userId]);
        client.release();
        return result?.rows?.[0]?.data ?? E_NOT_FOUND;
    } catch (e) {
        console.error('getUserById errors', userId, e);
        return E_UNEXPECTED_ERROR;
    }
};

export default getUserById;
