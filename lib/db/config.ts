import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from '@/db/schema';

// Database configuration
const config = {
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool({
  connectionString: config.url,
  ssl: config.ssl,
  max: config.max,
  idleTimeoutMillis: config.idleTimeoutMillis,
  connectionTimeoutMillis: config.connectionTimeoutMillis,
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

// Database migration function
export async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Database connection test
export async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection() {
  try {
    await pool.end();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

export default db;