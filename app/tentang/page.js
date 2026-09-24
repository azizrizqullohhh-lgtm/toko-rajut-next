export const metadata = { title: 'Tentang Kami' };

export default function TentangPage() {
  return (
    <>
      <section className="section page-header">
        <div className="section-inner">
          <h1>Tentang Toko Rajut Superman</h1>
          <p>Mengenal lebih dekat cerita di balik setiap produk rajutan kami.</p>
        </div>
      </section>

      <section className="section tentang-section">
        <div className="section-inner tentang-layout">
          <div className="tentang-visual" aria-hidden="true">
            <div className="yarn-blob small"></div>
            <div className="hero-emoji">🧣</div>
          </div>

          <div className="tentang-text">
            <h2>Dari Benang, Menjadi Cerita</h2>
            <p>
              Toko Rajut Superman berawal dari kecintaan pada kerajinan tangan
              tradisional. Kami bekerja sama dengan pengrajin rajut lokal
              untuk menghadirkan produk-produk berkualitas — mulai dari tas,
              sweater, cardigan, hingga aksesoris dan mainan rajut.
            </p>
            <p>
              Setiap produk dibuat dengan tangan, bukan mesin pabrik —
              sehingga setiap potong punya karakter dan sentuhan personal yang
              berbeda. Kami percaya, produk handmade membawa nilai lebih dari
              sekadar fungsi: ada cerita dan ketekunan di setiap simpul
              benangnya.
            </p>
            <h3>Visi Kami</h3>
            <p>
              Melestarikan kerajinan rajut lokal sambil memberdayakan para
              pengrajin, agar karya tangan Indonesia bisa dinikmati lebih
              banyak orang.
            </p>
          </div>
        </div>
      </section>

      <section className="section nilai-section">
        <div className="section-inner nilai-grid">
          <div className="nilai-item">
            <span className="nilai-icon">🤝</span>
            <h3>Berdayakan Pengrajin</h3>
            <p>Setiap pembelian membantu pengrajin rajut lokal untuk terus berkarya.</p>
          </div>

          <div className="nilai-item">
            <span className="nilai-icon">🌱</span>
            <h3>Ramah Lingkungan</h3>
            <p>Kami memilih bahan berkualitas dan proses produksi yang minim limbah.</p>
          </div>

          <div className="nilai-item">
            <span className="nilai-icon">🎯</span>
            <h3>Kualitas Terjaga</h3>
            <p>Setiap produk melewati pengecekan kualitas sebelum dikirim ke pelanggan.</p>
          </div>

          <div className="nilai-item">
            <span className="nilai-icon">💬</span>
            <h3>Respon Ramah</h3>
            <p>
              Tim kami siap membantu lewat WhatsApp untuk pertanyaan produk
              maupun pesanan custom.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
