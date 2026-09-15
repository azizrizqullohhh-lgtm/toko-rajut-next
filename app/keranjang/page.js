'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../../components/CartProvider';
import { formatRupiah } from '../../lib/format';

const NOMOR_WA = '6287786702861';

function buatTeksWhatsApp(isiKeranjang, totalHarga) {
  const baris = ['Halo, saya mau pesan produk berikut:', ''];
  isiKeranjang.forEach((item, i) => {
    baris.push(
      `${i + 1}. ${item.produk.nama_produk} x${item.jumlah} - ${formatRupiah(item.subtotal)}`
    );
  });
  baris.push('', `Total: ${formatRupiah(totalHarga)}`);
  return baris.join('\n');
}

export default function KeranjangPage() {
  const { items, loaded, updateQty, removeItem, clear } = useCart();
  const [produkMap, setProdukMap] = useState({});
  const [memuat, setMemuat] = useState(true);

  const idList = Object.keys(items);

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
      .catch((err) => console.error('Gagal memuat produk keranjang:', err))
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
  const teksWa =
    isiKeranjang.length > 0 ? buatTeksWhatsApp(isiKeranjang, totalHarga) : '';

  if (!loaded || memuat) {
    return (
      <section className="section page-header">
        <div className="section-inner">
          <h1>Keranjang Belanja</h1>
          <p>Memuat keranjang...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section page-header">
        <div className="section-inner">
          <h1>Keranjang Belanja</h1>
          <p>
            Kumpulkan dulu produk yang kamu mau, baru pesan semuanya sekaligus
            lewat WhatsApp.
          </p>
        </div>
      </section>

      <section className="section keranjang-section">
        <div className="section-inner">
          {isiKeranjang.length === 0 ? (
            <p className="empty-state">
              Keranjang kamu masih kosong.{' '}
              <Link href="/produk">Yuk lihat produk →</Link>
            </p>
          ) : (
            <>
              <div className="keranjang-list">
                {isiKeranjang.map((item) => {
                  const p = item.produk;
                  const gambarSrc = `/images/produk/${p.gambar || 'placeholder.svg'}`;
                  return (
                    <div className="keranjang-item" key={p.id_produk}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={gambarSrc}
                        alt={p.nama_produk}
                        onError={(e) => {
                          e.currentTarget.src = '/images/produk/placeholder.svg';
                        }}
                      />

                      <div className="keranjang-item-info">
                        <h3>
                          <Link href={`/produk/${p.id_produk}`}>{p.nama_produk}</Link>
                        </h3>
                        <span className="produk-harga">
                          {formatRupiah(p.harga)} / pcs
                        </span>
                      </div>

                      <div className="keranjang-item-qty">
                        <label htmlFor={`jumlah-${p.id_produk}`} className="sr-only">
                          Jumlah
                        </label>
                        <input
                          type="number"
                          min="1"
                          id={`jumlah-${p.id_produk}`}
                          value={item.jumlah}
                          onChange={(e) =>
                            updateQty(
                              p.id_produk,
                              Math.max(1, parseInt(e.target.value, 10) || 1)
                            )
                          }
                        />
                      </div>

                      <div className="keranjang-item-subtotal">
                        {formatRupiah(item.subtotal)}
                      </div>

                      <button
                        type="button"
                        className="keranjang-item-hapus btn-hapus"
                        aria-label="Hapus produk ini dari keranjang"
                        onClick={() => removeItem(p.id_produk)}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="keranjang-ringkasan">
                <div className="keranjang-total">
                  <span>Total</span>
                  <strong>{formatRupiah(totalHarga)}</strong>
                </div>

                <div className="keranjang-aksi-bawah">
                  <button type="button" className="btn btn-outline" onClick={clear}>
                    Kosongkan Keranjang
                  </button>

                  <a
                    className="btn btn-outline btn-pesan-wa"
                    href={`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teksWa)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tanya via WhatsApp
                  </a>

                  <Link href="/checkout" className="btn btn-primary">
                    Lanjutkan ke Checkout →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
