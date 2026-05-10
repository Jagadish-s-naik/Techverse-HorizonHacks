import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});
export const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    }
    catch (error) {
        if (error.code === 'XX000' || error.message.includes('Tenant or user not found')) {
            console.error('CRITICAL: Supabase project not found or paused. Check your DATABASE_URL project ID.');
        }
        throw error;
    }
};
//# sourceMappingURL=db.js.map