'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export default function DetailTambahForm({ idProduk }) {
  const { addItem } = useCart();
  const [jumlah, setJumlah] = useState(1);
  const [ditambahkan, setDitambahkan] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    addItem(idProduk, jumlah);
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="detail-tambah-form">
      <label htmlFor="jumlah-beli">Jumlah</label>
      <input
        type="number"
        id="jumlah-beli"
        name="jumlah"
        min="1"
        value={jumlah}
        onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value, 10) || 1))}
      />

      <button type="submit" className="btn btn-primary btn-pesan">
        {ditambahkan ? 'Ditambahkan ke Keranjang ✓' : 'Tambah ke Keranjang'}
      </button>
    </form>
  );
}
