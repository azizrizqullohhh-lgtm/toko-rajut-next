import { ambilSemuaKategori } from '../../../../lib/queries';
import { hapusKategoriAction } from './actions';
import TambahKategoriForm from './TambahKategoriForm';

export const metadata = { title: 'Kelola Kategori' };
export const dynamic = 'force-dynamic';

export default async function AdminKategoriPage() {
  const kategoriList = await ambilSemuaKategori();

  return (
    <>
      <h1 className="admin-title">Kelola Kategori</h1>
      <p className="admin-subtitle">
        Tambah kategori baru atau hapus kategori yang tidak dipakai.
      </p>

      <div className="admin-two-col">
        <div className="admin-card">
          <h2>Tambah Kategori</h2>
          <TambahKategoriForm />
        </div>

        <div className="admin-card">
          <h2>Daftar Kategori</h2>
          {kategoriList.length === 0 ? (
            <p className="empty-state">Belum ada kategori.</p>
          ) : (
            <ul className="admin-list">
              {kategoriList.map((k) => (
                <li key={k.id_kategori}>
                  <span>{k.nama_kategori}</span>
                  <form action={hapusKategoriAction}>
                    <input type="hidden" name="id_kategori" value={k.id_kategori} />
                    <button type="submit" className="btn-mini btn-mini-hapus">
                      Hapus
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <p className="admin-hint">
            ⚠️ Menghapus kategori akan ikut menghapus semua produk di dalamnya.
          </p>
        </div>
      </div>
    </>
  );
}
