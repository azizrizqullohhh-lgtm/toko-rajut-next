import './globals.css';
import { CartProvider } from '../components/CartProvider';
import SiteChrome from '../components/SiteChrome';

export const metadata = {
  title: {
    default: 'Toko Rajut Superman',
    template: '%s — Toko Rajut Superman',
  },
  description:
    'Toko Rajut Superman — produk rajutan tangan asli: tas, sweater, cardigan, topi, hingga mainan rajut.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
