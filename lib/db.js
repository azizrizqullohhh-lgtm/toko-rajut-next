import { Pool } from 'pg';

let pool;

/**
 * Ambil satu instance Pool koneksi Postgres (dibuat sekali, dipakai ulang).
 * Baca connection string dari environment variable DATABASE_URL.
 * Di Vercel, isi env var ini lewat Project Settings -> Environment Variables.
 */
export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL belum diset. Tambahkan environment variable DATABASE_URL yang berisi connection string Postgres kamu.'
    );
  }

  if (!pool) {
    const isLocal = process.env.DATABASE_URL.includes('localhost') ||
      process.env.DATABASE_URL.includes('127.0.0.1');

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }

  return pool;
}
