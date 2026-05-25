import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import fs from 'fs';

// Check if database migrations directory exists
if (!fs.existsSync('./migrations')) {
  console.log('Skipping database migration: "./migrations" directory not found (Mode 1 / Mode 2).');
  process.exit(0);
}

// Check if Drizzle configuration file exists
if (!fs.existsSync('./drizzle.config.ts')) {
  console.log('Skipping database migration: "drizzle.config.ts" not found (Mode 1 / Mode 2).');
  process.exit(0);
}

// Check if models directory exists
if (!fs.existsSync('./src/models')) {
  console.log('Skipping database migration: "./src/models" directory not found (Mode 1 / Mode 2).');
  process.exit(0);
}

const databaseUrl = process.env.DATABASE_URL;

// If we are on Vercel or in a non-TTY environment/CI, check if the database URL points to localhost/127.0.0.1.
// If it does, we should skip migrations because the local dev server (pglite) won't be running.
const isLocalhost = databaseUrl && (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1'));
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;

if (isVercel && isLocalhost) {
  console.log('Skipping database migration during Vercel build because DATABASE_URL points to localhost/127.0.0.1.');
  process.exit(0);
}

if (!databaseUrl) {
  console.log('Skipping database migration: DATABASE_URL is not set.');
  process.exit(0);
}

console.log('Running database migrations programmatically...');
const pool = new pg.Pool({
  connectionString: databaseUrl,
});

const db = drizzle({ client: pool });

try {
  await migrate(db, { migrationsFolder: './migrations' });
  console.log('Database migration completed successfully.');
  await pool.end();
  process.exit(0);
} catch (error) {
  console.error('Database migration failed:', error);
  await pool.end();
  process.exit(1);
}
