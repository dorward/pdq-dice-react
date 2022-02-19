import pool from '../dbConfig/dbConnector';
import { E_NOT_FOUND } from '../errors';
import { User } from '../types';

export const getUserByCode = async (
    code: string,
): Promise<User | typeof E_NOT_FOUND | undefined> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT data FROM user_data WHERE data @> $1;';
        const result = await client.query(sql, [{ code }]);
        client.release();
        return result?.rows?.[0]?.data ?? E_NOT_FOUND;
    } catch (e) {
        console.error('getUserById errors', e);
        return;
    }
};

export default getUserByCode;
