import { Pool } from 'pg';
import dotenv from 'dotenv';
import { query as sqliteQuery } from './localDb';

dotenv.config();

let startPostgres = false;
let pool: Pool;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')) {
    // Basic check, in reality we might want to try-catch the connection
    console.log('Using PostgreSQL');
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    startPostgres = true;
} else {
    // Fallback
    console.log('Using SQLite Fallback');
}

export const query = async (text: string, params?: any[]) => {
    if (startPostgres) {
        return pool.query(text, params);
    } else {
        return sqliteQuery(text, params);
    }
};
