'use client';

import { useMemo, useState } from 'react';

function rupiah(angka) {
  const n = Number(angka) || 0;
  return 'Rp' + n.toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

function tanggalWaktu(tanggal) {
  return new Date(tanggal).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', ' •');
}

export default function PrintReportModal({ transaksi = [] }) {
  const [terbuka, setTerbuka] = useState(false);

  const ringkasan = useMemo(() => {
    const transaksiValid = transaksi.filter((t) => t.status !== 'dibatalkan');
    const itemTerjual = transaksiValid.reduce(
      (total, t) => total + (t.items || []).reduce((n, item) => n + Number(item.jumlah || 0), 0),
      0
    );
    const total = transaksiValid.reduce((total, t) => total + Number(t.total_harga || 0), 0);
    return { transaksi: transaksi.length, itemTerjual, total };
  }, [transaksi]);

  function cetak() {
    window.print();
  }

  return (
    <>
      <button type="button" className="btn btn-outline no-print" onClick={() => setTerbuka(true)}>
        🖨️ Cetak Laporan
      </button>

      {terbuka && (
        <div className="report-modal" role="dialog" aria-modal="true" aria-label="Pratinjau laporan transaksi">
          <div className="report-modal-backdrop" onClick={() => setTerbuka(false)} />
          <div className="report-modal-panel">
            <div className="report-modal-actions">
              <button type="button" className="report-print-btn" onClick={cetak}>
                Cetak / Simpan PDF
              </button>
              <button type="button" className="report-close-btn" onClick={() => setTerbuka(false)}>
                Tutup
              </button>
            </div>

            <div className="receipt-report print-receipt">
              <div className="receipt-head">
                <strong>LAPORAN PENJUALAN</strong>
                <span>TOKO RAJUT</span>
              </div>

              {transaksi.length === 0 ? (
                <div className="receipt-empty">Belum ada transaksi.</div>
              ) : (
                transaksi.map((t) => (
                  <div className={`receipt-transaction ${t.status === 'dibatalkan' ? 'receipt-cancelled' : ''}`} key={t.id_transaksi}>
                    <div className="receipt-row receipt-meta">
                      <span>#{t.id_transaksi}</span>
                      <span>{tanggalWaktu(t.dibuat_pada)}</span>
                    </div>
                    {t.status === 'dibatalkan' && <div className="receipt-status">DIBATALKAN</div>}
                    {(t.items || []).map((item) => (
                      <div className="receipt-item" key={item.id_item}>
                        <div className="receipt-product-name">{item.nama_produk}</div>
                        <div className="receipt-row receipt-item-detail">
                          <span>{item.jumlah} x {rupiah(item.harga_satuan)}</span>
                          <span>{rupiah(item.subtotal)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="receipt-row receipt-subtotal">
                      <span>Total Transaksi</span>
                      <span>{rupiah(t.total_harga)}</span>
                    </div>
                  </div>
                ))
              )}

              <div className="receipt-summary">
                <div className="receipt-row"><span>Transaksi</span><strong>{ringkasan.transaksi}</strong></div>
                <div className="receipt-row"><span>Item Terjual</span><strong>{ringkasan.itemTerjual} pcs</strong></div>
                <div className="receipt-row receipt-total"><strong>TOTAL</strong><strong>{rupiah(ringkasan.total)}</strong></div>
              </div>
              <div className="receipt-thanks">Terima kasih</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
