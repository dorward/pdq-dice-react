import pool from '../dbConfig/dbConnector';
import { StatisticsHighLow } from '../types';

const recordHighLowRoll = async ({
    characterName,
    seekingHigh,
    success,
    roll,
}: StatisticsHighLow) => {
    const client = await pool.connect();
    try {
        const sql = `
            INSERT INTO statistics_high_low 
            (characterName, seekingHigh, success, roll) 
            VALUES ($1, $2, $3, $4) 
        `;
        const values = [characterName, seekingHigh, success, roll];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
};

export default recordHighLowRoll;
