'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export default function AddToCartButton({ idProduk, jumlah = 1, className, children }) {
  const { addItem } = useCart();
  const [ditambahkan, setDitambahkan] = useState(false);

  function handleClick() {
    addItem(idProduk, jumlah);
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 1500);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {ditambahkan ? 'Ditambahkan ✓' : children}
    </button>
  );
}
