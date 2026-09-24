import { notFound } from 'next/navigation';
import { ambilSemuaKategori, ambilProdukById } from '../../../../../lib/queries';
import { editProdukById } from '../actions';
import ProdukForm from '../ProdukForm';

export const metadata = { title: 'Edit Produk' };
export const dynamic = 'force-dynamic';

export default async function EditProdukPage({ params }) {
  const idProduk = parseInt(params.id, 10);
  if (!idProduk) notFound();

  const [kategoriList, produk] = await Promise.all([
    ambilSemuaKategori(),
    ambilProdukById(idProduk),
  ]);

  if (!produk) notFound();

  const actionTerikat = editProdukById.bind(null, idProduk);

  return (
    <>
      <h1 className="admin-title">Edit Produk</h1>
      <p className="admin-subtitle">Ubah detail “{produk.nama_produk}”.</p>

      <div className="admin-card admin-card-form">
        <ProdukForm
          action={actionTerikat}
          kategoriList={kategoriList}
          produk={produk}
          labelTombol="Simpan Perubahan"
        />
      </div>
    </>
  );
}
