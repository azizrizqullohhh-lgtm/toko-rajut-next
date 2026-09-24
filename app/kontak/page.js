import KontakForm from './KontakForm';

export const metadata = { title: 'Kontak' };

export default function KontakPage() {
  return (
    <>
      <section className="section page-header">
        <div className="section-inner">
          <h1>Hubungi Kami</h1>
          <p>
            Ada pertanyaan seputar produk atau ingin pesan custom? Kirim pesan
            atau hubungi kami langsung.
          </p>
        </div>
      </section>

      <section className="section kontak-section">
        <div className="section-inner kontak-layout">
          <div className="kontak-info">
            <div className="kontak-card">
              <span className="kontak-icon">💬</span>
              <div>
                <h3>WhatsApp</h3>
                <a href="https://wa.me/6287786702861" target="_blank" rel="noopener noreferrer">
                  +62 877-8670-2861
                </a>
              </div>
            </div>
            <div className="kontak-card">
              <span className="kontak-icon">✉️</span>
              <div>
                <h3>Email</h3>
                <a href="mailto:halo@tokorajutsuperman.id">halo@tokorajutsuperman.id</a>
              </div>
            </div>
            <div className="kontak-card">
              <span className="kontak-icon">📍</span>
              <div>
                <h3>Lokasi</h3>
                <span>Ponorogo, Jawa Timur, Indonesia</span>
              </div>
            </div>
          </div>

          <KontakForm />
        </div>
      </section>
    </>
  );
}
