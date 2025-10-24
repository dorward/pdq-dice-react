import pool from '../../dbConfig/dbConnector';
import { E_DB_ERROR } from '../../errors';
import { Session, SkillCheckStatisticsReport } from '../../types';

const sql = `
WITH filtered AS (
    SELECT
        userid,
        charactername,
        description,
        roll,
        bonus,
        total,
        bonuses,
        benny
    FROM statistics_skill_checks
    WHERE eventtime BETWEEN $1 AND $2
),

-- Rank rows by highest values per category
ranked AS (
    SELECT
        userid,
        charactername,
        description,
        roll,
        bonus,
        total,
        bonuses,
        benny,
        jsonb_array_length(bonuses->'bonuses') AS bonus_type_count,
        ROW_NUMBER() OVER (PARTITION BY userid, charactername ORDER BY roll DESC) AS rn_roll,
        ROW_NUMBER() OVER (PARTITION BY userid, charactername ORDER BY bonus DESC) AS rn_bonus,
        ROW_NUMBER() OVER (PARTITION BY userid, charactername ORDER BY total DESC) AS rn_total,
        ROW_NUMBER() OVER (PARTITION BY userid, charactername ORDER BY jsonb_array_length(bonuses->'bonuses') DESC) AS rn_bonus_types
    FROM filtered
),

-- Aggregate by character and user
aggregated AS (
    SELECT
        userid,
        charactername,
        MAX(roll) AS highest_roll,
        MAX(bonus) AS highest_bonus_sum,
        MAX(total) AS highest_total,
        MAX(jsonb_array_length(bonuses->'bonuses')) AS most_bonus_types,
        COUNT(*) FILTER (WHERE benny = TRUE) AS rolls_with_benny
    FROM filtered
    GROUP BY userid, charactername
),

-- Join each "max" to its originating row for the description
descriptions AS (
    SELECT DISTINCT ON (userid, charactername)
        userid,
        charactername,
        description AS highest_roll_description
    FROM ranked
    WHERE rn_roll = 1
),
bonus_descriptions AS (
    SELECT DISTINCT ON (userid, charactername)
        userid,
        charactername,
        description AS highest_bonus_sum_description
    FROM ranked
    WHERE rn_bonus = 1
),
total_descriptions AS (
    SELECT DISTINCT ON (userid, charactername)
        userid,
        charactername,
        description AS highest_total_description
    FROM ranked
    WHERE rn_total = 1
),
bonus_type_descriptions AS (
    SELECT DISTINCT ON (userid, charactername)
        userid,
        charactername,
        description AS most_bonus_types_description
    FROM ranked
    WHERE rn_bonus_types = 1
)

SELECT
    a.userid,
    a.charactername,
    a.highest_roll,
    d.highest_roll_description,
    a.highest_bonus_sum,
    bd.highest_bonus_sum_description,
    a.highest_total,
    td.highest_total_description,
    a.most_bonus_types,
    btd.most_bonus_types_description,
    a.rolls_with_benny
FROM aggregated a
LEFT JOIN descriptions d USING (userid, charactername)
LEFT JOIN bonus_descriptions bd USING (userid, charactername)
LEFT JOIN total_descriptions td USING (userid, charactername)
LEFT JOIN bonus_type_descriptions btd USING (userid, charactername)
ORDER BY charactername;`;

export const getSkillChecks = async (
    session: Session,
): Promise<SkillCheckStatisticsReport[] | typeof E_DB_ERROR> => {
    try {
        const client = await pool.connect();
        const params = [session.session_start, session.session_end];
        let debugSQL = sql;
        params.forEach((p, i) => {
            console.log('Param is:', typeof p, p);
            const v = typeof p === 'string' ? `'${p}'` : p;
            debugSQL = debugSQL.replace(`$${i + 1}`, v as string);
        });
        const result = await client.query<SkillCheckStatisticsReport>(sql, params);
        client.release();
        // console.log('Executing SQL with values:\n', debugSQL);
        // console.log({ r: result.rows, c: result.rowCount, session }, { depth: 6 });

        return result.rows ?? E_DB_ERROR;
    } catch (e) {
        console.error('getSkillCheckStatsSession errors', e);
        return E_DB_ERROR;
    }
};

export default getSkillChecks;
