import pool from '../dbConfig/dbConnector';
import { E_NOT_FOUND } from '../errors';
import { User } from '../types';

export const getUserByCode = async (code: string): Promise<User | typeof E_NOT_FOUND> => {
    const sql = 'SELECT data FROM user_data WHERE data @> $1;';
    const result = await pool.query(sql, [{ code }]);
    return result?.rows?.[0]?.data ?? E_NOT_FOUND;
};
