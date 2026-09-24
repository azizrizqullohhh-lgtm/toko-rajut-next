import Link from 'next/link';
import { ambilProduk } from '../../../../lib/queries';
import { formatRupiah } from '../../../../lib/format';
import { hapusProdukAction } from './actions';

export const metadata = { title: 'Kelola Produk' };
export const dynamic = 'force-dynamic';

export default async function AdminProdukPage() {
  const produkList = await ambilProduk(null, null);

  return (
    <>
      <div className="admin-title-row">
        <div>
          <h1 className="admin-title">Kelola Produk</h1>
          <p className="admin-subtitle">Tambah, ubah, atau hapus produk yang tampil di toko.</p>
        </div>
        <Link href="/admin/produk/baru" className="btn btn-primary">
          + Tambah Produk
        </Link>
      </div>

      <div className="admin-card">
        {produkList.length === 0 ? (
          <p className="empty-state">Belum ada produk. Tambahkan produk pertamamu.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Unggulan</th>
                  <th aria-label="Aksi"></th>
                </tr>
              </thead>
              <tbody>
                {produkList.map((p) => (
                  <tr key={p.id_produk}>
                    <td>{p.nama_produk}</td>
                    <td>{p.nama_kategori}</td>
                    <td>{formatRupiah(p.harga)}</td>
                    <td>{p.stok}</td>
                    <td>{p.is_unggulan ? '✔' : '—'}</td>
                    <td className="admin-table-aksi">
                      <Link href={`/admin/produk/${p.id_produk}`} className="btn-mini">
                        Edit
                      </Link>
                      <form action={hapusProdukAction}>
                        <input type="hidden" name="id_produk" value={p.id_produk} />
                        <button type="submit" className="btn-mini btn-mini-hapus">
                          Hapus
                        </button>
                      </form>
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
