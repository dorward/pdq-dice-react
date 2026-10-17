import pool from '../dbConfig/dbConnector';

const getLuckRolls = async (userId: string, characterId: string, characterName: string) => {
    const { rows } = await pool.query(
        `WITH filtered AS (
            SELECT id, eventTime AS "eventTime", seekingHigh AS "seekingHigh", roll, success
            FROM statistics_high_low
            WHERE userId = $1 AND (characterId = $2 OR (characterId IS NULL AND characterName = $3))
        ), recent AS (
            SELECT * FROM filtered ORDER BY "eventTime" DESC, id DESC LIMIT 5
        )
        SELECT
            (SELECT COALESCE(json_agg(recent ORDER BY "eventTime" DESC, id DESC), '[]'::json) FROM recent) AS rolls,
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE success) AS successes,
            COUNT(*) FILTER (WHERE "seekingHigh") AS high,
            COUNT(*) FILTER (WHERE "seekingHigh" AND success) AS "highSuccesses",
            COUNT(*) FILTER (WHERE NOT "seekingHigh") AS low,
            COUNT(*) FILTER (WHERE NOT "seekingHigh" AND success) AS "lowSuccesses"
        FROM filtered`,
        [userId, characterId, characterName],
    );
    const stats = rows[0];
    const percentage = (successes: string, total: string) =>
        Number(total) ? (100 * Number(successes)) / Number(total) : null;
    return {
        rolls: stats.rolls,
        percentages: {
            overall: percentage(stats.successes, stats.total),
            high: percentage(stats.highSuccesses, stats.high),
            low: percentage(stats.lowSuccesses, stats.low),
        },
    };
};

export default getLuckRolls;
