
import sql from 'mssql';
import { config as dotenvConfig } from 'dotenv';

// Force load environment variables
dotenvConfig({ path: '.env' });

const config = {
    server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', 
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        integratedSecurity: true,
    }
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
    if (pool && pool.connected) {
        return pool;
    }
    try {
        pool = new sql.ConnectionPool(config);
        await pool.connect();
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        pool = null; // Reset pool on connection error
        throw err;
    }
}

// Helper to close the connection pool, useful for cleanup
export async function closeConnection() {
    if (pool) {
        await pool.close();
        pool = null;
    }
}
