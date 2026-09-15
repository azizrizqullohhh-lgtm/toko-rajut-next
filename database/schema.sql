-- =========================================================
-- Database: toko_rajut (versi PostgreSQL)
-- Dikonversi dari database/toko_rajut.sql (MySQL) milik proyek asli
-- Cara pakai: jalankan file ini di Postgres kamu, misalnya:
--   psql "$DATABASE_URL" -f database/schema.sql
-- atau tempel isinya di SQL editor Neon/Supabase/Railway.
-- =========================================================

CREATE TABLE IF NOT EXISTS kategori (
    id_kategori   SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    slug          VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produk (
    id_produk    SERIAL PRIMARY KEY,
    id_kategori  INTEGER NOT NULL REFERENCES kategori(id_kategori) ON DELETE CASCADE ON UPDATE CASCADE,
    nama_produk  VARCHAR(100) NOT NULL,
    deskripsi    TEXT,
    harga        NUMERIC(10, 2) NOT NULL,
    stok         INTEGER NOT NULL DEFAULT 0,
    gambar       VARCHAR(150) NOT NULL DEFAULT 'placeholder.svg',
    is_unggulan  BOOLEAN NOT NULL DEFAULT FALSE,
    dibuat_pada  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pesan_masuk (
    id_pesan     SERIAL PRIMARY KEY,
    nama         VARCHAR(100) NOT NULL,
    email        VARCHAR(100) NOT NULL,
    pesan        TEXT NOT NULL,
    dikirim_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Admin (untuk login admin & proteksi halaman CRUD produk)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
    id_admin      SERIAL PRIMARY KEY,
    username      VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    dibuat_pada   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Transaksi & Item Transaksi (checkout tersimpan di database)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS transaksi (
    id_transaksi     SERIAL PRIMARY KEY,
    kode_transaksi   VARCHAR(20) NOT NULL UNIQUE,
    nama_pembeli     VARCHAR(100) NOT NULL,
    email_pembeli    VARCHAR(100) NOT NULL,
    telepon_pembeli  VARCHAR(30) NOT NULL,
    alamat_pembeli   TEXT NOT NULL,
    catatan          TEXT,
    total_harga      NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status           VARCHAR(20) NOT NULL DEFAULT 'menunggu_konfirmasi',
    dibuat_pada      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transaksi_item (
    id_item       SERIAL PRIMARY KEY,
    id_transaksi  INTEGER NOT NULL REFERENCES transaksi(id_transaksi) ON DELETE CASCADE,
    id_produk     INTEGER REFERENCES produk(id_produk) ON DELETE SET NULL,
    nama_produk   VARCHAR(100) NOT NULL,
    harga_satuan  NUMERIC(10, 2) NOT NULL,
    jumlah        INTEGER NOT NULL,
    subtotal      NUMERIC(12, 2) NOT NULL
);

-- Akun admin default: username "admin", password "admin123"
-- (hash scrypt dibuat lewat lib/auth.js — SEGERA ganti passwordnya setelah login pertama!)
INSERT INTO admin (username, password_hash) VALUES
('admin', 'c7cdae3eaf4ee1efb889ad6967bdb9da:428e6c649f553c36ecb374b11a04237816569a7320d5ce16b42def288401294a4ce461eace8acd0296f07675acc8e08b9b7b0975b94615a6229119226005ef2a')
ON CONFLICT (username) DO NOTHING;

-- ---------------------------------------------------------
-- Data contoh (nama file gambar sudah disesuaikan dengan
-- file yang benar-benar ada di public/images/produk)
-- ---------------------------------------------------------
INSERT INTO kategori (nama_kategori, slug) VALUES
('Tas Rajut', 'tas-rajut'),
('Sweater & Cardigan', 'sweater-cardigan'),
('Topi & Aksesoris', 'topi-aksesoris'),
('Mainan Rajut', 'mainan-rajut')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produk (id_kategori, nama_produk, deskripsi, harga, stok, gambar, is_unggulan) VALUES
(1, 'Tas Rajut Selempang Krem', 'Tas rajut handmade bahan katun premium, cocok untuk kegiatan santai maupun kerja.', 125000.00, 12, 'tas-selempang-krem.jpg', true),
(1, 'Tas Rajut Tote Bag Motif Bunga', 'Tote bag rajut ukuran besar dengan motif bunga rajut timbul, muat laptop 14 inci.', 165000.00, 8, 'tas-rajut-tote-bag-motif-bunga.jpg', true),
(2, 'Cardigan Rajut Oversize', 'Cardigan rajut oversize hangat, cocok dipakai di dataran tinggi atau musim hujan.', 210000.00, 15, 'cardingan-rajut-oversize.jpg', true),
(2, 'Sweater Rajut Motif Kabel', 'Sweater rajut dengan pola cable knit klasik, bahan wol campuran lembut di kulit.', 235000.00, 10, 'sweater-rajut-motif-kabel.jpg', false),
(3, 'Topi Beanie Rajut Polos', 'Topi beanie rajut hangat dengan berbagai pilihan warna netral.', 45000.00, 25, 'topi-beanie-rajut-polos.jpg', false),
(3, 'Scarf Rajut Rumbai', 'Syal rajut panjang dengan rumbai di kedua ujungnya, motif garis dua warna.', 60000.00, 18, 'scarf-rajut-rumbai.jpg', false),
(4, 'Boneka Rajut Beruang Mini', 'Boneka rajut amigurumi karakter beruang, tinggi sekitar 15cm, aman untuk anak.', 55000.00, 20, 'boneka-rajut-beruang-mini.jpg', true),
(4, 'Gantungan Kunci Rajut Karakter', 'Gantungan kunci rajut lucu berbagai karakter, cocok untuk hadiah kecil.', 20000.00, 40, 'gantungan-kunci-rajut-karakter.jpg', false);
