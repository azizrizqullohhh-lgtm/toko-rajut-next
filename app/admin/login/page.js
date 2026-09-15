import LoginForm from './LoginForm';

export const metadata = { title: 'Login Admin' };

export default function AdminLoginPage({ searchParams }) {
  const redirectTo = searchParams?.redirect || '/admin';

  return (
    <section className="section admin-login-section">
      <div className="section-inner admin-login-wrap">
        <div className="admin-login-card">
          <h1>Login Admin</h1>
          <p>Masuk untuk mengelola produk, kategori, dan pesanan.</p>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </section>
  );
}
