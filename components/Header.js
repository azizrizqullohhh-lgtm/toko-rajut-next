'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from './CartProvider';

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  const linkClass = (path, exact = true) => {
    const active = exact ? pathname === path : pathname.startsWith(path);
    return active ? 'active' : '';
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">🧶</span>
          <span className="brand-text">
            Toko Rajut <em>Superman</em>
          </span>
        </Link>

        <nav className={`main-nav${open ? ' open' : ''}`}>
          <Link href="/" className={linkClass('/')} onClick={() => setOpen(false)}>
            Beranda
          </Link>
          <Link href="/produk" className={linkClass('/produk', false)} onClick={() => setOpen(false)}>
            Produk
          </Link>
          <Link href="/tentang" className={linkClass('/tentang')} onClick={() => setOpen(false)}>
            Tentang Kami
          </Link>
          <Link href="/kontak" className={linkClass('/kontak')} onClick={() => setOpen(false)}>
            Kontak
          </Link>
          <Link
            href="/keranjang"
            className={`nav-keranjang ${linkClass('/keranjang')}`}
            onClick={() => setOpen(false)}
          >
            🛒 Keranjang
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
