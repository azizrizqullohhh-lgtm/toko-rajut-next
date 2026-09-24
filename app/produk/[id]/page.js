import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ambilProdukById } from '../../../lib/queries';
import { formatRupiah } from '../../../lib/format';
import DetailTambahForm from '../../../components/DetailTambahForm';
import GambarProduk from '../../../components/GambarProduk';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const idProduk = parseInt(params.id, 10);
  if (!idProduk) return {};
  const produk = await ambilProdukById(idProduk);
  return { title: produk ? produk.nama_produk : 'Produk' };
}

export default async function DetailProdukPage({ params }) {
  const idProduk = parseInt(params.id, 10);
  const produk = idProduk ? await ambilProdukById(idProduk) : null;

  if (!produk) {
    notFound();
  }

  const gambarSrc = `/images/produk/${produk.gambar || 'placeholder.svg'}`;
  const teksWaLangsung = `Halo, saya tertarik dengan produk ${produk.nama_produk}`;

  return (
    <section className="section detail-section">
      <div className="section-inner">
        <Link href="/produk" className="back-link">
          ← Kembali ke Produk
        </Link>

        <div className="detail-layout">
          <div className="detail-gambar">
            <GambarProduk src={gambarSrc} alt={produk.nama_produk} />
          </div>

          <div className="detail-info">
            <span className="produk-kategori">{produk.nama_kategori}</span>
            <h1>{produk.nama_produk}</h1>
            <div className="detail-harga">{formatRupiah(produk.harga)}</div>
            <p className="detail-deskripsi">
              {(produk.deskripsi || '').split('\n').map((baris, i) => (
                <span key={i}>
                  {baris}
                  <br />
                </span>
              ))}
            </p>

            <div className="detail-stok">
              {Number(produk.stok) > 0 ? (
                <span className="stok-tersedia">
                  ✔ Stok tersedia ({Number(produk.stok)} pcs)
                </span>
              ) : (
                <span className="stok-habis">✘ Stok habis</span>
              )}
            </div>

            <DetailTambahForm idProduk={produk.id_produk} />

            <a
              href={`https://wa.me/6287786702861?text=${encodeURIComponent(teksWaLangsung)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-pesan-langsung"
            >
              atau pesan langsung 1 pcs via WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}