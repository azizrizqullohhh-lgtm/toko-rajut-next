import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ambilTransaksiById } from '../../../../lib/queries';
import { formatRupiah, formatTanggalWaktu } from '../../../../lib/format';
import { SESSION_COOKIE_NAME, readSessionToken } from '../../../../lib/auth';
import PrintButton from '../../../../components/PrintButton';

export const metadata = { title: 'Cetak Struk' };
export const dynamic = 'force-dynamic';

const LABEL_STATUS = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export default async function StrukTransaksiPage({ params }) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const username = readSessionToken(token);
  if (!username) {
    redirect('/admin/login');
  }

  const idTransaksi = parseInt(params.id, 10);
  if (!idTransaksi) notFound();

  const transaksi = await ambilTransaksiById(idTransaksi);
  if (!transaksi) notFound();

  const totalItem = (transaksi.items || []).reduce(
    (total, item) => total + Number(item.jumlah),
    0
  );

  return (
    <div className="struk-page">
      <div className="struk-toolbar no-print">
        <Link href="/admin/transaksi" className="btn btn-outline">
          ← Kembali ke Transaksi
        </Link>
        <PrintButton label="Cetak Struk" />
      </div>

      <div className="admin-card print-area struk-card">
        <div className="print-only-receipt">
          <h2 className="print-only-title">Struk Transaksi Toko Rajut</h2>

          <div className="receipt-entry">
            <div className="receipt-line receipt-line-head">
              <span>{transaksi.kode_transaksi}</span>
              <span>{formatTanggalWaktu(transaksi.dibuat_pada)}</span>
            </div>
            <div className="receipt-line">
              <span>{transaksi.nama_pembeli}</span>
              <span>{transaksi.telepon_pembeli}</span>
            </div>
            {transaksi.alamat_pembeli && (
              <div className="receipt-line">
                <span>{transaksi.alamat_pembeli}</span>
              </div>
            )}
            <div className="receipt-line">
              <span>Status</span>
              <span>{LABEL_STATUS[transaksi.status] || transaksi.status}</span>
            </div>
            <div className="receipt-divider" />

            {(transaksi.items || []).map((item) => (
              <div key={item.id_item}>
                <div className="receipt-item-nama">{item.nama_produk}</div>
                <div className="receipt-line">
                  <span>
                    {item.jumlah} x {formatRupiah(item.harga_satuan)}
                  </span>
                  <span>{formatRupiah(item.subtotal)}</span>
                </div>
              </div>
            ))}
            <div className="receipt-divider" />
          </div>

          <div className="receipt-line">
            <span>Item</span>
            <span>{totalItem} pcs</span>
          </div>
          <div className="receipt-line receipt-total">
            <span>TOTAL</span>
            <span>{formatRupiah(transaksi.total_harga)}</span>
          </div>
          <p className="receipt-terima-kasih">Terima kasih</p>
        </div>
      </div>
    </div>
  );
}