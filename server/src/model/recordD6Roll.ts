import pool from '../dbConfig/dbConnector';
import { StatisticsD6 } from '../types';

const recordD6Roll = async ({ userId, characterName, roll }: StatisticsD6) => {
    const client = await pool.connect();
    try {
        const sql = `
            INSERT INTO statistics_d6
            (userId, characterName, roll) 
            VALUES ($1, $2, $3) 
        `;
        const values = [userId, characterName, roll];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
};

export default recordD6Roll;
