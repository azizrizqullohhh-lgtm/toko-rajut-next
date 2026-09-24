'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatRupiah } from '../../../lib/format';

const NOMOR_WA = '6287786702861';

export default function CheckoutSuksesPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuksesContent />
    </Suspense>
  );
}

function CheckoutSuksesContent() {
  const searchParams = useSearchParams();
  const kode = searchParams.get('kode') || '-';
  const total = Number(searchParams.get('total') || 0);

  const teksWa = `Halo, saya baru saja membuat pesanan dengan kode ${kode} senilai ${formatRupiah(
    total
  )}. Mohon dikonfirmasi ya, terima kasih!`;

  return (
    <section className="section page-header">
      <div className="section-inner checkout-sukses">
        <div className="checkout-sukses-icon">✅</div>
        <h1>Pesanan Berhasil Dibuat!</h1>
        <p>
          Kode pesanan kamu: <strong>{kode}</strong>
        </p>
        <p>
          Total pembayaran: <strong>{formatRupiah(total)}</strong>
        </p>
        <p className="checkout-sukses-desc">
          Data pesanan sudah tersimpan di sistem kami. Untuk mempercepat
          proses, konfirmasi pesananmu lewat WhatsApp — sertakan kode
          pesanan di atas.
        </p>

        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <a
            className="btn btn-primary btn-pesan"
            href={`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teksWa)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Konfirmasi via WhatsApp
          </a>
          <Link href="/produk" className="btn btn-outline">
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </section>
  );
}
