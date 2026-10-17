import pool from '../dbConfig/dbConnector';
import { StatisticsHighLow } from '../types';

const recordHighLowRoll = async ({
    userId,
    characterName,
    characterId,
    seekingHigh,
    success,
    roll,
}: StatisticsHighLow) => {
    const client = await pool.connect();
    try {
        const sql = `
            INSERT INTO statistics_high_low
            (userId, characterName, seekingHigh, success, roll, characterId)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [userId, characterName, seekingHigh, success, roll, characterId];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
};

export default recordHighLowRoll;
