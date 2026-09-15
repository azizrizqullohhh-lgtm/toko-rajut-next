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
          <a href="/">Beranda</a>
          <a href="/produk">Produk</a>
          <a href="/tentang">Tentang Kami</a>
          <a href="/kontak">Kontak</a>
          <a href="/kontak">Admin</a>
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
          <a href="file:///D:/Tugas%20Serkom/profil-pribadi/index.html#about" target="_blank" rel="noopener noreferrer">
            Profil Pribadi
          </a>
          <a href="http://localhost:3000/admin/login" target="_blank" rel="noopener noreferrer">
            Admin
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Toko Rajut Superman. Dibuat untuk Uji Serkom — Skema Junior Web Developer.
      </div>
    </footer>
  );
}
