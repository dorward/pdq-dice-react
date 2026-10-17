import pool from '../dbConfig/dbConnector';
import { E_BAD_CODE, E_SAVE_CONFLICT } from '../errors';
import { User } from '../types';
import { Pool } from 'pg';

const addOrUpdateUser = async (
    userId: string,
    code: string,
    data: User,
    updateCode?: boolean,
    database: Pick<Pool, 'query'> = pool,
) => {
    if (updateCode) {
        // Credential refreshes must preserve characters saved by another request.
        const { characters: _characters, revision: _revision, ...credentials } = data;
        return database.query(
            `INSERT INTO user_data (userid, data) VALUES ($1, $2::jsonb || '{"revision":1}'::jsonb)
             ON CONFLICT (userid) DO UPDATE SET data = user_data.data || $3::jsonb ||
             jsonb_build_object('revision', COALESCE((user_data.data->>'revision')::bigint, 0) + 1)
             RETURNING data`,
            [userId, data, credentials],
        );
    }

    const revision = data?.revision ?? 0;
    if (!Number.isSafeInteger(revision) || revision < 0) throw new Error(E_SAVE_CONFLICT);
    const result = await database.query(
        `UPDATE user_data SET data = $1::jsonb || jsonb_build_object('revision', $4::bigint + 1)
         WHERE userid = $2 AND data->>'code' = $3
           AND COALESCE((data->>'revision')::bigint, 0) = $4
         RETURNING data`,
        [{ ...data, userId, code }, userId, code, revision],
    );
    if (result.rowCount) return result;

    const existing = await database.query('SELECT data FROM user_data WHERE userid=$1', [
        userId,
    ]);
    if (!existing.rowCount || existing.rows[0].data.code !== code) throw new Error(E_BAD_CODE);
    throw new Error(E_SAVE_CONFLICT);
};

export default addOrUpdateUser;
