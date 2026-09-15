import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'admin_session';

// Ganti ADMIN_SESSION_SECRET di .env.local / Environment Variables Vercel
// untuk produksi. Kalau tidak diset, dipakai nilai default (jangan dipakai
// untuk production sungguhan).
const SECRET = process.env.ADMIN_SESSION_SECRET || 'ganti-secret-ini-di-env-production';

/**
 * Hash password memakai scrypt (bawaan Node.js, tidak perlu install
 * dependency tambahan seperti bcrypt).
 */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/** Bandingkan password polos dengan hash "salt:hash" yang tersimpan di DB. */
export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  try {
    const hashBuffer = Buffer.from(hash, 'hex');
    const suppliedBuffer = crypto.scryptSync(password, salt, 64);
    return (
      hashBuffer.length === suppliedBuffer.length &&
      crypto.timingSafeEqual(hashBuffer, suppliedBuffer)
    );
  } catch {
    return false;
  }
}

function sign(value) {
  const hmac = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  return `${value}.${hmac}`;
}

function unsign(signed) {
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  return value;
}

/** Buat token session (username ditandatangani, tanpa perlu tabel session). */
export function createSessionToken(username) {
  return sign(username);
}

/** Baca & verifikasi token session, kembalikan username atau null kalau tidak valid. */
export function readSessionToken(token) {
  if (!token) return null;
  return unsign(token);
}
