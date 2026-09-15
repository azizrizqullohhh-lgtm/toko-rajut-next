import { ambilSemuaTransaksi } from '../../../../lib/queries';
import { formatRupiah } from '../../../../lib/format';

export const metadata = { title: 'Transaksi & Laporan' };
export const dynamic = 'force-dynamic';

const LABEL_STATUS = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export default async function AdminTransaksiPage() {
  const transaksiList = await ambilSemuaTransaksi();

  const totalPendapatan = transaksiList
    .filter((t) => t.status !== 'dibatalkan')
    .reduce((total, t) => total + Number(t.total_harga), 0);

  return (
    <>
      <h1 className="admin-title">Transaksi &amp; Laporan Penjualan</h1>
      <p className="admin-subtitle">
        {transaksiList.length} transaksi tercatat — total pendapatan{' '}
        <strong>{formatRupiah(totalPendapatan)}</strong>.
      </p>

      <div className="admin-card">
        {transaksiList.length === 0 ? (
          <p className="empty-state">Belum ada transaksi masuk dari checkout.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Pembeli</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList.map((t) => (
                  <tr key={t.id_transaksi}>
                    <td>{t.kode_transaksi}</td>
                    <td>
                      {t.nama_pembeli}
                      <br />
                      <span className="admin-table-sub">{t.telepon_pembeli}</span>
                    </td>
                    <td>{new Date(t.dibuat_pada).toLocaleString('id-ID')}</td>
                    <td>{formatRupiah(t.total_harga)}</td>
                    <td>
                      <span className={`status-pill status-${t.status}`}>
                        {LABEL_STATUS[t.status] || t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
