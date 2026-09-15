import Link from 'next/link';
import { ambilSemuaKategori, ambilProdukUnggulan } from '../lib/queries';
import ProductCard from '../components/ProductCard';

export const metadata = { title: 'Beranda' };

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [kategoriList, produkUnggulan] = await Promise.all([
    ambilSemuaKategori(),
    ambilProdukUnggulan(4),
  ]);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="eyebrow">Handmade • Lokal • Penuh Cinta</span>
            <h1>
              Rajutan Tangan yang
              <br />
              Menghangatkan Setiap Cerita
            </h1>
            <p>
              Setiap helai benang dirajut dengan tangan oleh pengrajin lokal
              kami — menghasilkan tas, sweater, dan aksesoris rajut yang
              hangat dan penuh karakter.
            </p>

            <div className="hero-actions">
              <Link href="/produk" className="btn btn-primary">
                Lihat Semua Produk
              </Link>
              <Link href="/tentang" className="btn btn-outline">
                Kenali Kami
              </Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="yarn-blob"></div>
            <div className="hero-emoji">🧶</div>
          </div>
        </div>
      </section>

      {/* ================= KATEGORI ================= */}
      <section className="section kategori-section">
        <div className="section-inner">
          <h2 className="section-title">Belanja Berdasarkan Kategori</h2>
          <div className="kategori-grid">
            {kategoriList.map((kat) => (
              <Link
                key={kat.id_kategori}
                href={`/produk?kategori=${kat.id_kategori}`}
                className="kategori-card"
              >
                <span className="kategori-icon">🧵</span>
                <span className="kategori-nama">{kat.nama_kategori}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUK UNGGULAN ================= */}
      <section className="section produk-section">
        <div className="section-inner">
          <div className="section-head-row">
            <h2 className="section-title">Produk Unggulan</h2>
            <Link href="/produk" className="lihat-semua">
              Lihat semua →
            </Link>
          </div>

          {produkUnggulan.length === 0 ? (
            <p className="empty-state">Belum ada produk unggulan saat ini.</p>
          ) : (
            <div className="produk-grid">
              {produkUnggulan.map((p) => (
                <ProductCard key={p.id_produk} produk={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= NILAI TAMBAH ================= */}
      <section className="section nilai-section">
        <div className="section-inner nilai-grid">
          <div className="nilai-item">
            <span className="nilai-icon">✋</span>
            <h3>Dibuat Tangan</h3>
            <p>
              Setiap produk dirajut manual oleh pengrajin, bukan mesin — jadi
              setiap potong punya karakter unik.
            </p>
          </div>

          <div className="nilai-item">
            <span className="nilai-icon">🌿</span>
            <h3>Bahan Berkualitas</h3>
            <p>
              Kami menggunakan benang katun dan wol pilihan yang nyaman dan
              tahan lama.
            </p>
          </div>

          <div className="nilai-item">
            <span className="nilai-icon">📦</span>
            <h3>Dikirim ke Seluruh Indonesia</h3>
            <p>
              Pengiriman aman lewat ekspedisi terpercaya, dikemas rapi agar
              tetap bagus sampai tujuan.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
