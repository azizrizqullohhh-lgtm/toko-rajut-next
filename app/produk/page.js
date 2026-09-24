import Link from 'next/link';
import { ambilSemuaKategori, ambilProduk } from '../../lib/queries';
import ProductCard from '../../components/ProductCard';

export const metadata = { title: 'Produk' };

export const dynamic = 'force-dynamic';

export default async function ProdukPage({ searchParams }) {
  const idKategoriFilter = searchParams?.kategori
    ? parseInt(searchParams.kategori, 10)
    : null;
  const kataKunci = (searchParams?.q || '').toString();

  const [kategoriList, produkList] = await Promise.all([
    ambilSemuaKategori(),
    ambilProduk(idKategoriFilter, kataKunci),
  ]);

  const kategoriAktif = idKategoriFilter
    ? kategoriList.find((k) => k.id_kategori === idKategoriFilter)
    : null;

  // Helper: bikin link kategori yang tetap membawa kata kunci pencarian
  function linkKategori(idKategori) {
    const params = new URLSearchParams();
    if (idKategori) params.set('kategori', idKategori);
    if (kataKunci) params.set('q', kataKunci);
    const qs = params.toString();
    return `/produk${qs ? `?${qs}` : ''}`;
  }

  return (
    <>
      <section className="section page-header">
        <div className="section-inner">
          <h1>{kategoriAktif ? kategoriAktif.nama_kategori : 'Semua Produk'}</h1>
          <p>
            Jelajahi koleksi rajutan tangan kami — dibuat dengan bahan pilihan
            dan penuh detail.
          </p>

          <form action="/produk" method="get" className="search-form" role="search">
            {idKategoriFilter && (
              <input type="hidden" name="kategori" value={idKategoriFilter} />
            )}
            <input
              type="search"
              name="q"
              defaultValue={kataKunci}
              placeholder="Cari nama produk, misalnya: tas, sweater, topi..."
              aria-label="Cari produk"
            />
            <button type="submit" className="btn btn-primary">
              Cari
            </button>
          </form>

          {kataKunci && (
            <p className="search-info">
              Menampilkan hasil pencarian untuk “{kataKunci}” —{' '}
              <Link href={linkKategori(idKategoriFilter)}>hapus pencarian</Link>
            </p>
          )}
        </div>
      </section>

      <section className="section produk-section">
        <div className="section-inner produk-layout">
          {/* Sidebar Filter */}
          <aside className="filter-sidebar">
            <h3>Kategori</h3>
            <ul className="filter-list">
              <li>
                <Link href={linkKategori(null)} className={!idKategoriFilter ? 'active' : ''}>
                  Semua Produk
                </Link>
              </li>
              {kategoriList.map((kat) => (
                <li key={kat.id_kategori}>
                  <Link
                    href={linkKategori(kat.id_kategori)}
                    className={idKategoriFilter === kat.id_kategori ? 'active' : ''}
                  >
                    {kat.nama_kategori}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Grid Produk */}
          <div className="produk-main">
            {produkList.length === 0 ? (
              <p className="empty-state">
                Produk tidak ditemukan{kataKunci ? ` untuk “${kataKunci}”` : ' pada kategori ini'}.
              </p>
            ) : (
              <div className="produk-grid">
                {produkList.map((p) => (
                  <ProductCard key={p.id_produk} produk={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
