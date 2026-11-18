import { sql } from 'drizzle-orm';
import { db, pool } from './db.js';
import { bears } from './db/schema.js';
import { fetchBears } from './services/bearService.js';

async function seed() {
  try {
    const fetchedBears = await fetchBears();
    const fetchedAt = new Date();

    await db
      .insert(bears)
      .values(
        fetchedBears.map((bear) => ({
          id: bear.id,
          name: bear.name,
          binomial: bear.binomial,
          fileName: bear.fileName,
          imageUrl: bear.image ?? null,
          range: bear.range,
          fetchedAt,
        }))
      )
      .onConflictDoUpdate({
        target: bears.id,
        set: {
          name: sql`excluded.name`,
          binomial: sql`excluded.binomial`,
          fileName: sql`excluded.file_name`,
          imageUrl: sql`excluded.image_url`,
          range: sql`excluded.range`,
          fetchedAt: sql`excluded.fetched_at`,
        },
      });

    console.log(`${fetchedBears.length} Bären gespeichert.`);
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('Seed fehlgeschlagen:', error);
  process.exitCode = 1;
});
