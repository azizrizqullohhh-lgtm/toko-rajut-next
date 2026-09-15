import { NextResponse } from 'next/server';
import { buatTransaksi } from '../../../lib/queries';

export const dynamic = 'force-dynamic';

function emailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Data tidak valid.' }, { status: 400 });
  }

  const nama = (body?.pembeli?.nama || '').toString().trim();
  const email = (body?.pembeli?.email || '').toString().trim();
  const telepon = (body?.pembeli?.telepon || '').toString().trim();
  const alamat = (body?.pembeli?.alamat || '').toString().trim();
  const catatan = (body?.pembeli?.catatan || '').toString().trim();
  const itemKeranjang = Array.isArray(body?.itemKeranjang) ? body.itemKeranjang : [];

  // ---------- Validasi form (server-side) ----------
  const kesalahan = {};
  if (!nama) kesalahan.nama = 'Nama wajib diisi.';
  if (!email || !emailValid(email)) kesalahan.email = 'Email tidak valid.';
  if (!telepon || telepon.replace(/\D/g, '').length < 9)
    kesalahan.telepon = 'Nomor telepon tidak valid.';
  if (!alamat || alamat.length < 10)
    kesalahan.alamat = 'Alamat pengiriman wajib diisi lengkap (minimal 10 karakter).';
  if (itemKeranjang.length === 0) kesalahan.keranjang = 'Keranjang belanja kosong.';

  const idsValid = itemKeranjang.every(
    (it) => Number.isInteger(it.id_produk) && Number.isInteger(it.jumlah) && it.jumlah > 0
  );
  if (!idsValid) kesalahan.keranjang = 'Data keranjang tidak valid.';

  if (Object.keys(kesalahan).length > 0) {
    return NextResponse.json({ error: 'Validasi gagal.', fields: kesalahan }, { status: 422 });
  }

  try {
    const hasil = await buatTransaksi({
      pembeli: { nama, email, telepon, alamat, catatan },
      itemKeranjang,
    });

    return NextResponse.json({
      id_transaksi: hasil.transaksi.id_transaksi,
      kode_transaksi: hasil.transaksi.kode_transaksi,
      total_harga: hasil.transaksi.total_harga,
    });
  } catch (err) {
    console.error('Gagal membuat transaksi:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kendala saat memproses pesanan.' },
      { status: 500 }
    );
  }
}
