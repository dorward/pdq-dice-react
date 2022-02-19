import pool from '../dbConfig/dbConnector';
import { E_BAD_CODE, E_NOT_FOUND, E_UNEXPECTED_ERROR } from '../errors';
import { User } from '../types';
import getUserById from './getUserById';

const addOrUpdateUser = async (
    userId: string,
    code: string,
    data: User,
    updateCode?: boolean,
) => {
    const user = await getUserById(userId);
    if (user === E_UNEXPECTED_ERROR) return E_UNEXPECTED_ERROR;
    if (user !== E_NOT_FOUND) {
        // Update
        if (!updateCode && user.code !== code) {
            throw new Error(E_BAD_CODE);
        }
        const client = await pool.connect();
        const sql = 'UPDATE user_data SET data=$1 WHERE userId=$2';
        const result = await client.query(sql, [data, userId]);
        client.release();
        return result;
    } else {
        // Insert
        const client = await pool.connect();
        const sql = 'INSERT INTO user_data VALUES($1, $2)';
        const result = await client.query(sql, [userId, data]);
        client.release();
        return result;
    }
};

export default addOrUpdateUser;
