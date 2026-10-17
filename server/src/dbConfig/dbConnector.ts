import pg, { Pool } from 'pg';

// 🧠 Prevent node-postgres from converting timestamps into JS Date objects.
// This keeps full microsecond precision and timezone info as raw text strings.
pg.types.setTypeParser(1114, (val) => val); // TIMESTAMP WITHOUT TIME ZONE
pg.types.setTypeParser(1184, (val) => val); // TIMESTAMP WITH TIME ZONE

export default new Pool({
    max: 20,
    connectionString:
        process.env.DATABASE_URL ?? 'postgres://postgres:newPassword@postgres:5432/pdq',
    idleTimeoutMillis: 30000,
});
