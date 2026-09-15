// Jalankan skema + data contoh ke database Postgres kamu.
// Pakai: DATABASE_URL="postgres://..." npm run db:seed
// (atau isi dulu file .env.local lalu jalankan `npm run db:seed`)

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL belum diset. Isi di .env.local atau environment variable.');
    process.exit(1);
  }

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  const isLocal =
    process.env.DATABASE_URL.includes('localhost') ||
    process.env.DATABASE_URL.includes('127.0.0.1');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  try {
    await pool.query(sql);
    console.log('Berhasil! Skema dan data contoh sudah dibuat di database.');
  } catch (err) {
    console.error('Gagal menjalankan schema.sql:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
