'use client';

export default function GambarProduk({ src, alt }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        e.currentTarget.src = '/images/produk/placeholder.svg';
      }}
    />
  );
}