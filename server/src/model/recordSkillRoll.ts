import pool from '../dbConfig/dbConnector';
import { StatisticsSkillCheck } from '../types';

const recordSkillRoll = async ({
    characterName,
    description,
    bonus,
    roll,
    total,
}: StatisticsSkillCheck) => {
    const client = await pool.connect();
    try {
        const sql = `
            INSERT INTO statistics_skill_checks 
            (characterName, description, bonus, roll, total) 
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [characterName, description, bonus, roll, total];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
};

export default recordSkillRoll;
