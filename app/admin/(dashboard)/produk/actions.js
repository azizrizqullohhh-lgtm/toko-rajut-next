'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { tambahProduk, updateProduk, hapusProduk } from '../../../../lib/queries';

function ambilDataForm(formData) {
  return {
    id_kategori: parseInt(formData.get('id_kategori'), 10),
    nama_produk: (formData.get('nama_produk') || '').toString().trim(),
    deskripsi: (formData.get('deskripsi') || '').toString().trim(),
    harga: parseFloat(formData.get('harga')) || 0,
    stok: parseInt(formData.get('stok'), 10) || 0,
    gambar: (formData.get('gambar') || '').toString().trim() || 'placeholder.svg',
    is_unggulan: formData.get('is_unggulan') === 'on',
  };
}

function validasiProduk(data) {
  const err = {};
  if (!data.nama_produk) err.nama_produk = 'Nama produk wajib diisi.';
  if (!data.id_kategori) err.id_kategori = 'Kategori wajib dipilih.';
  if (!(data.harga > 0)) err.harga = 'Harga harus lebih besar dari 0.';
  if (data.stok < 0) err.stok = 'Stok tidak boleh negatif.';
  return err;
}

export async function buatProdukBaru(prevState, formData) {
  const data = ambilDataForm(formData);
  const errors = validasiProduk(data);
  if (Object.keys(errors).length > 0) {
    return { status: 'gagal', errors };
  }

  try {
    await tambahProduk(data);
  } catch (err) {
    console.error('Gagal menambah produk:', err);
    return { status: 'error', errors: {}, pesan: 'Gagal menyimpan ke database.' };
  }

  revalidatePath('/admin/produk');
  revalidatePath('/produk');
  redirect('/admin/produk');
}

export async function editProdukById(idProduk, prevState, formData) {
  const data = ambilDataForm(formData);
  const errors = validasiProduk(data);
  if (Object.keys(errors).length > 0) {
    return { status: 'gagal', errors };
  }

  try {
    await updateProduk(idProduk, data);
  } catch (err) {
    console.error('Gagal mengubah produk:', err);
    return { status: 'error', errors: {}, pesan: 'Gagal menyimpan perubahan.' };
  }

  revalidatePath('/admin/produk');
  revalidatePath('/produk');
  revalidatePath(`/produk/${idProduk}`);
  redirect('/admin/produk');
}

export async function hapusProdukAction(formData) {
  const idProduk = parseInt(formData.get('id_produk'), 10);
  if (!idProduk) return;

  await hapusProduk(idProduk);
  revalidatePath('/admin/produk');
  revalidatePath('/produk');
}
