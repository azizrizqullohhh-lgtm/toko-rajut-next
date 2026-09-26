import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logoutAdmin } from '../login/actions';
import { SESSION_COOKIE_NAME, readSessionToken } from '../../../lib/auth';

export const metadata = { title: { default: 'Admin', template: '%s — Admin' } };
export const dynamic = 'force-dynamic';

export default function AdminDashboardLayout({ children }) {
  // Verifikasi tanda tangan session di sini (Node.js runtime, bukan Edge)
  // supaya cookie palsu/tidak valid tidak bisa lolos masuk ke dashboard.
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const username = readSessionToken(token);

  if (!username) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">🧶 Admin Toko</div>
        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/produk">Produk</Link>
          <Link href="/admin/kategori">Kategori</Link>
          <Link href="/admin/transaksi">Transaksi</Link>
          <Link href="/admin/laporan">Laporan</Link>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" className="admin-link-muted">
            ← Lihat website
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className="btn btn-outline admin-btn-logout">
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
