'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'toko-rajut-keranjang';

export function CartProvider({ children }) {
  const [items, setItems] = useState({}); // { [id_produk]: jumlah }
  const [loaded, setLoaded] = useState(false);

  // Muat keranjang dari localStorage saat pertama kali dibuka
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (err) {
      console.error('Gagal membaca keranjang dari localStorage', err);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Simpan setiap ada perubahan
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Gagal menyimpan keranjang ke localStorage', err);
    }
  }, [items, loaded]);

  const addItem = useCallback((idProduk, jumlah = 1) => {
    const id = String(idProduk);
    const qty = Math.max(1, parseInt(jumlah, 10) || 1);
    setItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + qty }));
  }, []);

  const updateQty = useCallback((idProduk, jumlah) => {
    const id = String(idProduk);
    const qty = parseInt(jumlah, 10) || 0;
    setItems((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((idProduk) => {
    const id = String(idProduk);
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const totalItems = useMemo(
    () => Object.values(items).reduce((total, qty) => total + qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, loaded, addItem, updateQty, removeItem, clear, totalItems }),
    [items, loaded, addItem, updateQty, removeItem, clear, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart harus dipakai di dalam <CartProvider>');
  }
  return ctx;
}
