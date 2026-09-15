'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../components/CartProvider';
import { formatRupiah } from '../../lib/format';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, loaded, clear } = useCart();
  const idList = Object.keys(items);

  const [produkMap, setProdukMap] = useState({});
  const [memuat, setMemuat] = useState(true);
  const [form, setForm] = useState({
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
    catatan: '',
  });
  const [errors, setErrors] = useState({});
  const [mengirim, setMengirim] = useState(false);
  const [errorUmum, setErrorUmum] = useState('');

  useEffect(() => {
    if (!loaded) return;

    if (idList.length === 0) {
      setProdukMap({});
      setMemuat(false);
      return;
    }

    let batal = false;
    setMemuat(true);

    fetch(`/api/produk-by-ids?ids=${idList.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        if (batal) return;
        const map = {};
        (data.produk || []).forEach((p) => {
          map[p.id_produk] = p;
        });
        setProdukMap(map);
      })
      .finally(() => {
        if (!batal) setMemuat(false);
      });

    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, JSON.stringify(idList)]);

  const isiKeranjang = idList
    .map((id) => {
      const produk = produkMap[id];
      if (!produk) return null;
      const jumlah = items[id];
      return { produk, jumlah, subtotal: jumlah * Number(produk.harga) };
    })
    .filter(Boolean);

  const totalHarga = isiKeranjang.reduce((total, item) => total + item.subtotal, 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validasiForm() {
    const err = {};
    if (!form.nama.trim()) err.nama = 'Nama wajib diisi.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Email tidak valid.';
    if (!form.telepon.trim() || form.telepon.replace(/\D/g, '').length < 9)
      err.telepon = 'Nomor telepon tidak valid (minimal 9 digit).';
    if (!form.alamat.trim() || form.alamat.trim().length < 10)
      err.alamat = 'Alamat pengiriman wajib diisi lengkap.';
    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorUmum('');

    const err = validasiForm();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setMengirim(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pembeli: form,
          itemKeranjang: isiKeranjang.map((item) => ({
            id_produk: item.produk.id_produk,
            jumlah: item.jumlah,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        setErrorUmum(data.error || 'Gagal memproses pesanan.');
        return;
      }

      clear();
      router.push(
        `/checkout/sukses?kode=${encodeURIComponent(data.kode_transaksi)}&total=${data.total_harga}`
      );
    } catch (err2) {
      console.error(err2);
      setErrorUmum('Terjadi kendala jaringan. Coba lagi sebentar lagi.');
    } finally {
      setMengirim(false);
    }
  }

  if (!loaded || memuat) {
    return (
      <section className="section page-header">
        <div className="section-inner">
          <h1>Checkout</h1>
          <p>Memuat data keranjang...</p>
        </div>
      </section>
    );
  }

  if (isiKeranjang.length === 0) {
    return (
      <section className="section page-header">
        <div className="section-inner">
          <h1>Checkout</h1>
          <p className="empty-state">
            Keranjang kamu masih kosong.{' '}
            <Link href="/produk">Yuk lihat produk →</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section page-header">
        <div className="section-inner">
          <h1>Checkout</h1>
          <p>Isi data pengiriman untuk menyelesaikan pesananmu.</p>
        </div>
      </section>

      <section className="section checkout-section">
        <div className="section-inner checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <h3>Data Pembeli</h3>

            {errorUmum && <div className="alert alert-gagal">{errorUmum}</div>}

            <label htmlFor="nama">Nama Lengkap</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama penerima"
            />
            {errors.nama && <span className="field-error">{errors.nama}</span>}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@contoh.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}

            <label htmlFor="telepon">Nomor WhatsApp / Telepon</label>
            <input
              type="tel"
              id="telepon"
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
            />
            {errors.telepon && <span className="field-error">{errors.telepon}</span>}

            <label htmlFor="alamat">Alamat Pengiriman</label>
            <textarea
              id="alamat"
              name="alamat"
              rows={4}
              value={form.alamat}
              onChange={handleChange}
              placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kota, kode pos"
            />
            {errors.alamat && <span className="field-error">{errors.alamat}</span>}

            <label htmlFor="catatan">Catatan (opsional)</label>
            <textarea
              id="catatan"
              name="catatan"
              rows={2}
              value={form.catatan}
              onChange={handleChange}
              placeholder="Contoh: warna favorit, waktu pengiriman, dll."
            />

            <button type="submit" className="btn btn-primary" disabled={mengirim}>
              {mengirim ? 'Memproses...' : `Buat Pesanan — ${formatRupiah(totalHarga)}`}
            </button>
          </form>

          <div className="checkout-ringkasan">
            <h3>Ringkasan Pesanan</h3>
            <div className="checkout-item-list">
              {isiKeranjang.map((item) => (
                <div className="checkout-item" key={item.produk.id_produk}>
                  <span className="checkout-item-nama">
                    {item.produk.nama_produk} <span>× {item.jumlah}</span>
                  </span>
                  <span className="checkout-item-subtotal">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatRupiah(totalHarga)}</strong>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
