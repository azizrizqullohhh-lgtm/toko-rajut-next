'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ambilAdminByUsername } from '../../../lib/queries';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from '../../../lib/auth';

export async function loginAdmin(prevState, formData) {
  const username = (formData.get('username') || '').toString().trim();
  const password = (formData.get('password') || '').toString();
  const redirectTo = (formData.get('redirect') || '/admin').toString();

  if (!username || !password) {
    return { status: 'gagal', pesan: 'Username dan password wajib diisi.' };
  }

  let admin;
  try {
    admin = await ambilAdminByUsername(username);
  } catch (err) {
    console.error('Gagal mengambil data admin:', err);
    return { status: 'error', pesan: 'Terjadi kendala koneksi database.' };
  }

  if (!admin || !verifyPassword(password, admin.password_hash)) {
    return { status: 'gagal', pesan: 'Username atau password salah.' };
  }

  const token = createSessionToken(admin.username);
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 jam
  });

  redirect(redirectTo && redirectTo.startsWith('/admin') ? redirectTo : '/admin');
}

export async function logoutAdmin() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}
