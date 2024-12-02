import pool from '../dbConfig/dbConnector';
import { StatisticsSkillCheck } from '../types';

const recordSkillRoll = async ({
    userId,
    characterName,
    description,
    bonus,
    bonuses,
    benny,
    roll,
    total,
}: StatisticsSkillCheck) => {
    const client = await pool.connect();
    try {
        const sql = `
            INSERT INTO statistics_skill_checks 
            (userId, characterName, description, bonus, roll, total, bonuses, benny) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const values = [
            userId,
            characterName,
            description,
            bonus,
            roll,
            total,
            { bonuses },
            benny,
        ];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
};

export default recordSkillRoll;
