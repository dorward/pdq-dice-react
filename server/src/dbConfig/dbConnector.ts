import { Pool } from 'pg';

// TODO Get these from the environment

export default new Pool({
    max: 20,
    connectionString: 'postgres://postgres:newPassword@postgres16:5432/pdq',
    idleTimeoutMillis: 30000,
});
