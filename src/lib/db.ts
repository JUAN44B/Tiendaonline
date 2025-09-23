import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    port: Number(process.env.DB_PORT) || 1433,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        instanceName: 'SQLEXPRESS',
        integratedSecurity: process.env.DB_INTEGRATED_SECURITY === 'true',
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
