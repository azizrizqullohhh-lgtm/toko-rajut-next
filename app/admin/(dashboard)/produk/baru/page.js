import { ambilSemuaKategori } from '../../../../../lib/queries';
import { buatProdukBaru } from '../actions';
import ProdukForm from '../ProdukForm';

export const metadata = { title: 'Tambah Produk' };
export const dynamic = 'force-dynamic';

export default async function TambahProdukPage() {
  const kategoriList = await ambilSemuaKategori();

  return (
    <>
      <h1 className="admin-title">Tambah Produk Baru</h1>
      <p className="admin-subtitle">Lengkapi detail produk yang akan ditampilkan di toko.</p>

      <div className="admin-card admin-card-form">
        <ProdukForm
          action={buatProdukBaru}
          kategoriList={kategoriList}
          produk={null}
          labelTombol="Simpan Produk"
        />
      </div>
    </>
  );
}
