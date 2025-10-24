import pool from '../dbConfig/dbConnector';
import { Session } from '../types';
import { E_NO_SESSIONS } from '../errors';

const sql = `
WITH all_rolls AS (
    SELECT eventtime FROM statistics_d6
    UNION ALL
    SELECT eventtime FROM statistics_high_low
    UNION ALL
    SELECT eventtime FROM statistics_skill_checks
),
ordered_rolls AS (
    SELECT 
        eventtime,
        LAG(eventtime) OVER (ORDER BY eventtime) AS prev_eventtime
    FROM all_rolls
),
marked_sessions AS (
    SELECT 
        eventtime,
        CASE 
            WHEN prev_eventtime IS NULL THEN 1
            WHEN eventtime - prev_eventtime > INTERVAL '48 hours' THEN 1
            ELSE 0
        END AS session_break
    FROM ordered_rolls
),
session_ids AS (
    SELECT 
        eventtime,
        SUM(session_break) OVER (ORDER BY eventtime ROWS UNBOUNDED PRECEDING) AS session_id
    FROM marked_sessions
)
SELECT 
    MIN(eventtime) AS session_start,
    MAX(eventtime) AS session_end
FROM session_ids
GROUP BY session_id
ORDER BY session_start;
`;

const getSessions = async (): Promise<Session[] | typeof E_NO_SESSIONS> => {
    try {
        const client = await pool.connect();
        const result = await client.query<Session>(sql, []);
        client.release();
        // console.log({ result: result.rows }, { depth: 6 });
        return result?.rows ?? E_NO_SESSIONS;
    } catch (e) {
        console.error('getStatistics errors', e);
        return E_NO_SESSIONS;
    }
};

export default getSessions;
