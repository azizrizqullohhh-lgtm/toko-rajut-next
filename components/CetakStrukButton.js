'use client';

import { useState } from 'react';

const LABEL_STATUS = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export default function CetakStrukButton({ idTransaksi }) {
  const [loading, setLoading] = useState(false);

  async function cetakStruk() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/transaksi/${idTransaksi}`);
      if (!res.ok) throw new Error('Gagal mengambil data transaksi.');
      const transaksi = await res.json();

      const totalItem = (transaksi.items || []).reduce(
        (total, item) => total + Number(item.jumlah),
        0
      );

      const html = buatHtmlStruk(transaksi, totalItem);

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();

      const bersihkan = () => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      };

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };
      iframe.contentWindow.addEventListener('afterprint', bersihkan);
      setTimeout(bersihkan, 15000);
    } catch (err) {
      console.error('Gagal mencetak struk:', err);
      alert('Gagal mencetak struk. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className="btn-mini" onClick={cetakStruk} disabled={loading}>
      {loading ? 'Memuat...' : 'Cetak Struk'}
    </button>
  );
}

function rp(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

function waktu(tanggal) {
  return new Date(tanggal).toLocaleString('id-ID');
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buatHtmlStruk(transaksi, totalItem) {
  const itemsHtml = (transaksi.items || [])
    .map(
      (item) => `
        <div class="item-nama">${esc(item.nama_produk)}</div>
        <div class="baris">
          <span>${item.jumlah} x ${rp(item.harga_satuan)}</span>
          <span>${rp(item.subtotal)}</span>
        </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Struk ${esc(transaksi.kode_transaksi)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; width: 320px; margin: 0 auto; padding: 16px; color: #222; }
  h2 { text-align: center; font-size: 16px; margin: 0 0 12px; }
  .baris { display: flex; justify-content: space-between; font-size: 13px; margin: 2px 0; }
  .baris-head { font-weight: bold; }
  .item-nama { font-size: 13px; margin-top: 8px; font-weight: bold; }
  .divider { border-top: 1px dashed #333; margin: 8px 0; }
  .total { font-weight: bold; font-size: 15px; }
  .terima-kasih { text-align: center; margin-top: 14px; font-size: 13px; }
</style>
</head>
<body>
  <h2>Struk Transaksi Toko Rajut</h2>
  <div class="baris baris-head"><span>${esc(transaksi.kode_transaksi)}</span><span>${waktu(transaksi.dibuat_pada)}</span></div>
  <div class="baris"><span>${esc(transaksi.nama_pembeli)}</span><span>${esc(transaksi.telepon_pembeli)}</span></div>
  ${transaksi.alamat_pembeli ? `<div class="baris"><span>${esc(transaksi.alamat_pembeli)}</span></div>` : ''}
  <div class="baris"><span>Status</span><span>${LABEL_STATUS[transaksi.status] || transaksi.status}</span></div>
  <div class="divider"></div>
  ${itemsHtml}
  <div class="divider"></div>
  <div class="baris"><span>Item</span><span>${totalItem} pcs</span></div>
  <div class="baris total"><span>TOTAL</span><span>${rp(transaksi.total_harga)}</span></div>
  <p class="terima-kasih">Terima kasih</p>
</body>
</html>`;
}