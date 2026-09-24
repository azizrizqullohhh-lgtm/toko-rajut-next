export default function RunningText({ items }) {
  const daftar = items && items.length > 0 ? items : [
    'Gratis ongkir untuk pembelian di atas Rp250.000',
    'Semua produk dirajut tangan oleh pengrajin lokal',
    'Bisa custom warna & motif sesuai pesanan',
    'Pengiriman ke seluruh Indonesia',
  ];

  const teks = daftar.join('   •   ');

  return (
    <div className="running-text" role="marquee" aria-label="Informasi berjalan">
      <div className="running-text-track">
        <span className="running-text-item">{teks}</span>
        <span className="running-text-item" aria-hidden="true">{teks}</span>
      </div>
    </div>
  );
}