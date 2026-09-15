import Link from 'next/link';

export default function ProdukTidakDitemukan() {
  return (
    <section className="section page-header">
      <div className="section-inner">
        <h1>Produk Tidak Ditemukan</h1>
        <p>Produk yang kamu cari tidak ada atau sudah dihapus.</p>
        <Link href="/produk" className="btn btn-primary">
          Kembali ke Produk
        </Link>
      </div>
    </section>
  );
}
