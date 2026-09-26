import Link from 'next/link';
import { ambilSemuaTransaksi } from '../../../../lib/queries';
import { formatRupiah } from '../../../../lib/format';
import UbahStatusSelect from './UbahStatusSelect';

export const metadata = { title: 'Transaksi & Laporan' };
export const dynamic = 'force-dynamic';

const LABEL_STATUS = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export default async function AdminTransaksiPage({ searchParams }) {
  const kataKunci = (searchParams?.q || '').toString();
  const status = (searchParams?.status || '').toString();
  const dari = (searchParams?.dari || '').toString();
  const sampai = (searchParams?.sampai || '').toString();

  const adaFilter = Boolean(kataKunci || status || dari || sampai);

  const transaksiList = await ambilSemuaTransaksi({ kataKunci, status, dari, sampai });

  const totalPendapatan = transaksiList
    .filter((t) => t.status !== 'dibatalkan')
    .reduce((total, t) => total + Number(t.total_harga), 0);

  return (
    <>
      <h1 className="admin-title">Transaksi &amp; Laporan Penjualan</h1>
      <p className="admin-subtitle">
        {transaksiList.length} transaksi{adaFilter ? ' sesuai filter' : ' tercatat'} — total pendapatan{' '}
        <strong>{formatRupiah(totalPendapatan)}</strong>.
      </p>

      <div className="admin-card">
        <form action="/admin/transaksi" method="get" className="admin-filter-form">
          <div className="admin-filter-field">
            <label htmlFor="q">Cari</label>
            <input
              type="search"
              id="q"
              name="q"
              defaultValue={kataKunci}
              placeholder="Kode transaksi, nama, atau telepon pembeli..."
            />
          </div>

          <div className="admin-filter-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={status}>
              <option value="">Semua Status</option>
              {Object.entries(LABEL_STATUS).map(([nilai, label]) => (
                <option key={nilai} value={nilai}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-filter-field">
            <label htmlFor="dari">Dari Tanggal</label>
            <input type="date" id="dari" name="dari" defaultValue={dari} />
          </div>

          <div className="admin-filter-field">
            <label htmlFor="sampai">Sampai Tanggal</label>
            <input type="date" id="sampai" name="sampai" defaultValue={sampai} />
          </div>

          <div className="admin-filter-aksi">
            <button type="submit" className="btn btn-primary">
              Terapkan Filter
            </button>
            {adaFilter && (
              <Link href="/admin/transaksi" className="btn btn-outline">
                Reset
              </Link>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        {transaksiList.length === 0 ? (
          <p className="empty-state">
            {adaFilter
              ? 'Tidak ada transaksi yang cocok dengan filter tersebut.'
              : 'Belum ada transaksi masuk dari checkout.'}
          </p>
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
                      <UbahStatusSelect idTransaksi={t.id_transaksi} statusAwal={t.status} />
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