// Versioned, non-interactive migrations. Do not run drizzle-kit push in production.
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
(async () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : false });
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
    await migrate(drizzle(pool), { migrationsFolder: './migrations' });
    console.log('Database migrations complete');
  } finally { await pool.end(); }
})().catch(error => { console.error('Migration failed:', error.message); process.exit(1); });
