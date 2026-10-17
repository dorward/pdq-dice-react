import pool from '../dbConfig/dbConnector';

const getRecentSkillChecks = async (
    userId: string,
    characterId: string,
    characterName: string,
    page = 1,
) => {
    const result = await pool.query(
        `SELECT id, eventTime AS "eventTime", description, bonus, bonuses, roll, total, benny
         FROM statistics_skill_checks
         WHERE userId = $1 AND (characterId = $2 OR (characterId IS NULL AND characterName = $3))
         ORDER BY eventTime DESC, id DESC
         LIMIT 11 OFFSET $4`,
        [userId, characterId, characterName, (page - 1) * 10],
    );
    return {
        checks: result.rows
            .slice(0, 10)
            .map((row) => ({ ...row, bonuses: row.bonuses?.bonuses ?? [] })),
        hasMore: result.rows.length > 10,
    };
};

export default getRecentSkillChecks;
