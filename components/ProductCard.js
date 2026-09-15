import Link from 'next/link';
import { formatRupiah } from '../lib/format';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ produk, tampilkanBadge = true }) {
  const gambarSrc = `/images/produk/${produk.gambar || 'placeholder.svg'}`;

  return (
    <div className="produk-card">
      <Link href={`/produk/${produk.id_produk}`} className="produk-card-link">
        <div className="produk-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gambarSrc}
            alt={produk.nama_produk}
          />

          {tampilkanBadge && produk.is_unggulan && (
            <span className="badge-unggulan">Unggulan</span>
          )}
        </div>

        <div className="produk-info">
          <span className="produk-kategori">{produk.nama_kategori}</span>
          <h3 className="produk-nama">{produk.nama_produk}</h3>
          <span className="produk-harga">
            {formatRupiah(produk.harga)}
          </span>
        </div>
      </Link>

      <AddToCartButton
        idProduk={produk.id_produk}
        jumlah={1}
        className="btn-tambah-keranjang"
      >
        + Keranjang
      </AddToCartButton>
    </div>
  );
}