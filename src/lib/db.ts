import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Use true for Azure SQL Database, or if you have an SSL certificate
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Change to true for local dev / self-signed certs
    }
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
    if (pool) {
        return pool.connect();
    }
    try {
        pool = new sql.ConnectionPool(config);
        return await pool.connect();
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
