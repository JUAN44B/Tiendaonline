
import sql from 'mssql';
import { config as dotenvConfig } from 'dotenv';

const getConfig = (): sql.config => {
    dotenvConfig({ path: '.env' });
    
    const dbServer = process.env.DB_SERVER;

    if (!dbServer) {
        throw new Error('Database server is not configured. Please check your .env file for DB_SERVER.');
    }

    return {
        server: dbServer,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true', 
            trustServerCertificate: true,
            instanceName: process.env.DB_INSTANCE_NAME,
        },
    };
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
    if (pool && pool.connected) {
        return pool;
    }
    try {
        const config = getConfig();
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
