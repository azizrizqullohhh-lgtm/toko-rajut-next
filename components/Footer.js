import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="brand-text footer-brand">
            🧶 Toko Rajut <em>Superman</em>
          </div>
          <p>
            Produk rajutan tangan buatan pengrajin lokal — dibuat dengan bahan
            berkualitas dan penuh perhatian pada detail.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigasi</h4>
          <Link href="/">Beranda</Link>
          <Link href="/produk">Produk</Link>
          <Link href="/tentang">Tentang Kami</Link>
          <Link href="/kontak">Kontak</Link>
        </div>

        <div className="footer-col">
          <h4>Hubungi Kami</h4>
          <a href="https://wa.me/6287786702861" target="_blank" rel="noopener noreferrer">
            WhatsApp: +62 877-8670-2861
          </a>
          <a href="mailto:halo@tokorajutsuperman.id">halo@tokorajutsuperman.id</a>
          <a href="https://instagram.com/tokorajutsuparman" target="_blank" rel="noopener noreferrer">
            @tokorajutsuperman
          </a>
          <Link href="/admin/login">Admin</Link>
           <a href="">foto profil</a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Toko Rajut Superman. Dibuat untuk Uji Serkom — Skema Junior Web Developer.
      </div>
    </footer>
  );
}