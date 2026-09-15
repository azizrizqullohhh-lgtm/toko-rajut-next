# Toko Rajut Superman — versi Next.js + PostgreSQL

Ini adalah hasil konversi dari proyek **PHP + MySQL** (`toko-rajut/`) supaya bisa
di-deploy langsung ke **Vercel**. Vercel tidak menjalankan PHP dan tidak
menyediakan server MySQL, jadi seluruh aplikasi ditulis ulang memakai
**Next.js (App Router)** untuk tampilan/logika, dan **PostgreSQL** untuk
database (bisa pakai Neon, Vercel Postgres, Supabase, Railway, dll — semuanya
gratis untuk skala kecil).

Semua fitur asli tetap ada, ditambah beberapa fitur baru untuk memenuhi
ketentuan Uji Kompetensi Junior Web Developer:

- Katalog produk dari database + filter kategori
- **Pencarian produk** (nama & deskripsi) di halaman `/produk`
- Halaman detail produk
- Keranjang belanja (disimpan di `localStorage` browser, bukan session PHP
  di server — lebih cocok untuk arsitektur serverless Vercel)
- **Checkout** (`/checkout`) — form data pembeli dengan validasi, harga
  dihitung ulang dari database (bukan dari input browser), lalu **transaksi
  disimpan ke database** (tabel `transaksi` & `transaksi_item`) dan stok
  produk otomatis berkurang
- Halaman sukses checkout (`/checkout/sukses`) + tombol konfirmasi WhatsApp
- Form kontak yang datanya tersimpan ke tabel `pesan_masuk`
- **Login Admin** (`/admin/login`) yang melindungi seluruh halaman admin
- **Dashboard Admin** (`/admin`) — ringkasan produk, kategori, transaksi,
  total pendapatan, dan produk terlaris
- **CRUD Produk** (`/admin/produk`) — tambah, ubah, hapus produk
- **CRUD Kategori** (`/admin/kategori`) — tambah & hapus kategori
- **Laporan Penjualan / Transaksi** (`/admin/transaksi`) — daftar semua
  transaksi checkout beserta status dan totalnya

### Login Admin (default)

```
URL      : /admin/login
Username : admin
Password : admin123
```

⚠️ **Wajib diganti** setelah deploy — buat hash password baru lewat
`lib/auth.js` (`hashPassword('password-baru')`) lalu update kolom
`password_hash` di tabel `admin`, atau tambahkan admin baru lewat SQL
editor Neon/Supabase.

Juga disarankan mengganti `ADMIN_SESSION_SECRET` di Environment Variables
Vercel dengan string acak yang panjang, supaya session admin tidak bisa
dipalsukan.

## Struktur Folder

```
toko-rajut-next/
├── app/
│   ├── page.js                 # Beranda (ganti index.php)
│   ├── produk/page.js           # Daftar produk + filter kategori (ganti produk.php)
│   ├── produk/[id]/page.js       # Detail produk (ganti detail.php)
│   ├── tentang/page.js            # Tentang kami (ganti tentang.php)
│   ├── kontak/                     # Form kontak + server action (ganti kontak.php)
│   ├── keranjang/page.js            # Keranjang (ganti keranjang.php + keranjang-aksi.php)
│   ├── api/produk-by-ids/route.js    # API buat ambil detail produk di keranjang
│   ├── layout.js                       # Bungkus Header/Footer/CartProvider
│   └── globals.css                       # Sama persis dengan css/style.css asli
├── components/                             # Header, Footer, ProductCard, keranjang context, dll
├── lib/
│   ├── db.js                                 # Koneksi Postgres (ganti includes/koneksi.php)
│   ├── queries.js                             # Query database (ganti includes/fungsi.php)
│   └── format.js                               # formatRupiah()
├── database/
│   ├── schema.sql                                # Skema Postgres + data contoh
│   └── seed.js                                     # Script buat import schema.sql lewat Node
└── public/images/produk/                             # Foto produk (dipindah dari assets/images/produk)
```

## 1. Siapkan Database Postgres (gratis)

Pilih salah satu (paling gampang: **Neon**, karena terintegrasi langsung
dengan Vercel):

- **Neon** (https://neon.tech) — bisa juga langsung dari dashboard Vercel:
  Project → Storage → Create Database → Postgres (Powered by Neon)
- **Supabase** (https://supabase.com)
- **Railway** (https://railway.app)

Setelah dapat *connection string*-nya (biasanya seperti
`postgres://user:pass@host/dbname?sslmode=require`), jalankan skema + data
contoh dengan salah satu cara ini:

**Cara A — psql:**
```bash
psql "DATABASE_URL_KAMU" -f database/schema.sql
```

**Cara B — lewat Node (tanpa install psql):**
```bash
npm install
echo 'DATABASE_URL=postgres://...' > .env.local
npm run db:seed
```

**Cara C — copy-paste:** buka file `database/schema.sql`, copy semua isinya,
tempel ke SQL editor bawaan Neon/Supabase/Railway, lalu jalankan.

## 2. Jalankan di lokal (opsional, buat coba dulu)

```bash
npm install
cp .env.example .env.local     # lalu isi DATABASE_URL di .env.local
npm run dev
```

Buka `http://localhost:3000`.

## 3. Deploy ke Vercel

1. Push folder ini ke repo GitHub/GitLab/Bitbucket kamu.
2. Di Vercel: **Add New → Project**, pilih repo ini. Vercel otomatis
   mendeteksi Next.js, tidak perlu ubah setting build apa pun.
3. Di **Environment Variables**, tambahkan:
   - `DATABASE_URL` = connection string Postgres kamu
4. Klik **Deploy**.

Selesai — situs kamu akan jalan sepenuhnya di Vercel dengan database
Postgres asli, tanpa PHP sama sekali.

## Yang Perlu Kamu Sesuaikan

- **Nomor WhatsApp** — cari `6287786702861` di `components/Footer.js`,
  `app/produk/[id]/page.js`, `app/kontak/page.js`, dan `app/keranjang/page.js`,
  ganti dengan nomor asli.
- **Nama toko, email, Instagram** — di `components/Header.js` dan
  `components/Footer.js`.
- **Produk & harga** — edit langsung di database (lewat SQL editor
  Neon/Supabase), atau ubah `database/schema.sql` sebelum di-import.
- **Foto produk** — taruh file baru di `public/images/produk/`, lalu update
  kolom `gambar` di tabel `produk` supaya namanya cocok.

## Kenapa Tidak Tetap Pakai PHP?

Vercel menjalankan kode sebagai *serverless functions* (Node.js/Edge) dan
tidak punya PHP runtime maupun server MySQL bawaan. Kalau memang harus tetap
pakai PHP+MySQL apa adanya, pilihan paling gampang adalah hosting seperti
Railway, Niagahoster, atau Hostinger yang memang mendukung PHP+MySQL secara
native — bukan Vercel. Versi di folder ini sengaja ditulis ulang memakai
Next.js supaya bisa jalan 100% di Vercel sesuai permintaan.
