'use server';

import { revalidatePath } from 'next/cache';
import { tambahKategori, hapusKategori } from '../../../../lib/queries';

function buatSlug(nama) {
  return nama
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function tambahKategoriAction(prevState, formData) {
  const nama = (formData.get('nama_kategori') || '').toString().trim();

  if (!nama) {
    return { status: 'gagal', pesan: 'Nama kategori wajib diisi.' };
  }

  try {
    await tambahKategori(nama, buatSlug(nama));
  } catch (err) {
    console.error('Gagal menambah kategori:', err);
    return {
      status: 'gagal',
      pesan: 'Gagal menyimpan. Mungkin nama kategori sudah dipakai.',
    };
  }

  revalidatePath('/admin/kategori');
  revalidatePath('/produk');
  return { status: 'sukses', pesan: `Kategori “${nama}” berhasil ditambahkan.` };
}

export async function hapusKategoriAction(formData) {
  const idKategori = parseInt(formData.get('id_kategori'), 10);
  if (!idKategori) return;

  await hapusKategori(idKategori);
  revalidatePath('/admin/kategori');
  revalidatePath('/produk');
}
