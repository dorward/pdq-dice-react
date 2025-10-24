import pool from '../../dbConfig/dbConnector';
import { E_DB_ERROR } from '../../errors';
import { HighLowStatisticsReport, Session } from '../../types';

const sql = `
WITH filtered AS (
    SELECT
        hl.userid,
        hl.charactername,
        hl.success,
        hl.roll
    FROM statistics_high_low hl
    WHERE hl.eventtime BETWEEN $1 AND $2
),
aggregated AS (
    SELECT
        userid,
        COUNT(*) AS total_rolls,
        COUNT(*) FILTER (WHERE success = TRUE) AS successful_rolls,
        COUNT(*) FILTER (WHERE roll >= 4) AS high_rolls
    FROM filtered
    GROUP BY userid
),
most_common_name AS (
    SELECT userid, charactername
    FROM (
        SELECT 
            userid,
            charactername,
            COUNT(*) AS name_count,
            ROW_NUMBER() OVER (PARTITION BY userid ORDER BY COUNT(*) DESC) AS rn
        FROM filtered
        GROUP BY userid, charactername
    ) ranked
    WHERE rn = 1
)
SELECT 
    a.userid,
    a.total_rolls,
    a.successful_rolls,
    a.high_rolls,
    m.charactername AS most_common_charactername
FROM aggregated a
LEFT JOIN most_common_name m USING (userid)
ORDER BY most_common_charactername;
`;

const getHighLowStats = async (
    session: Session,
): Promise<HighLowStatisticsReport[] | typeof E_DB_ERROR> => {
    try {
        const client = await pool.connect();
        const result = await client.query<HighLowStatisticsReport>(sql, [
            session.session_start,
            session.session_end,
        ]);
        client.release();
        return result?.rows ?? E_DB_ERROR;
    } catch (e) {
        console.error('getHighLowStats errors', e);
        return E_DB_ERROR;
    }
};

export default getHighLowStats;
