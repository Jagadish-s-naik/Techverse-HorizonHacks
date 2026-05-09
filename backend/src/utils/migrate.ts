import { query } from '../config/db.ts';
import fs from 'fs';
import path from 'path';

async function migrate() {
  console.log('Starting migration...');

  try {
    const schemaPath = path.join(import.meta.dirname, '../../../db/schema.sql');
    const seedPath = path.join(import.meta.dirname, '../../../db/seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Applying schema...');
    await query(schemaSql);

    console.log('Applying seed data...');
    await query(seedSql);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
