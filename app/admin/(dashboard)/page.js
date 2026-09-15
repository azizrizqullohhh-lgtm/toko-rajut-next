import Link from 'next/link';
import { ambilRingkasanDashboard } from '../../../lib/queries';
import { formatRupiah } from '../../../lib/format';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const ringkasan = await ambilRingkasanDashboard();

  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      <p className="admin-subtitle">Ringkasan performa toko secara singkat.</p>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Produk</span>
          <span className="admin-stat-value">{ringkasan.totalProduk}</span>
          <Link href="/admin/produk">Kelola produk →</Link>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Kategori</span>
          <span className="admin-stat-value">{ringkasan.totalKategori}</span>
          <Link href="/admin/kategori">Kelola kategori →</Link>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Transaksi</span>
          <span className="admin-stat-value">{ringkasan.totalTransaksi}</span>
          <Link href="/admin/transaksi">Lihat transaksi →</Link>
        </div>
        <div className="admin-stat-card admin-stat-highlight">
          <span className="admin-stat-label">Total Pendapatan</span>
          <span className="admin-stat-value">{formatRupiah(ringkasan.totalPendapatan)}</span>
        </div>
      </div>

      <div className="admin-card">
        <h2>Produk Terlaris</h2>
        {ringkasan.produkTerlaris.length === 0 ? (
          <p className="empty-state">Belum ada penjualan tercatat.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Total Terjual</th>
              </tr>
            </thead>
            <tbody>
              {ringkasan.produkTerlaris.map((p, i) => (
                <tr key={i}>
                  <td>{p.nama_produk}</td>
                  <td>{p.total_terjual} pcs</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
