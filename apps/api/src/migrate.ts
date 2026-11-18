import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { pool } from './db.js';

async function main() {
  try {
    await migrate(drizzle({ client: pool }), {
      migrationsFolder: './drizzle',
    });
    console.log('Migrationen erfolgreich angewendet.');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Migration fehlgeschlagen:', error);
  process.exitCode = 1;
});
