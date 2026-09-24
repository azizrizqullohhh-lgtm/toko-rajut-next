'use server';

import { simpanPesanKontak } from '../../lib/queries';

function emailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function kirimPesanKontak(prevState, formData) {
  const nama = (formData.get('nama') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const pesan = (formData.get('pesan') || '').toString().trim();

  if (!nama || !email || !pesan || !emailValid(email)) {
    return { status: 'gagal' };
  }

  try {
    await simpanPesanKontak(nama, email, pesan);
    return { status: 'sukses' };
  } catch (err) {
    console.error('Gagal menyimpan pesan kontak:', err);
    return { status: 'error' };
  }
}
