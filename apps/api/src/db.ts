import pg from 'pg';
import { env } from './env.js';
import { drizzle } from 'drizzle-orm/node-postgres';

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 1_000,
  query_timeout: 1_000,
});
export const db = drizzle({ client: pool });
