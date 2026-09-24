import { getPool } from './db';

export async function ambilSemuaKategori() {
  const { rows } = await getPool().query(
    'SELECT * FROM kategori ORDER BY nama_kategori ASC'
  );
  return rows;
}

export async function ambilProdukUnggulan(limit = 4) {
  const { rows } = await getPool().query(
    `SELECT p.*, k.nama_kategori
     FROM produk p
     JOIN kategori k ON p.id_kategori = k.id_kategori
     WHERE p.is_unggulan = true
     ORDER BY p.dibuat_pada DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function ambilProduk(idKategori, kataKunci) {
  const kondisi = [];
  const nilai = [];

  if (idKategori) {
    nilai.push(idKategori);
    kondisi.push(`p.id_kategori = $${nilai.length}`);
  }

  if (kataKunci && kataKunci.trim() !== '') {
    nilai.push(`%${kataKunci.trim()}%`);
    kondisi.push(`(p.nama_produk ILIKE $${nilai.length} OR p.deskripsi ILIKE $${nilai.length})`);
  }

  const whereClause = kondisi.length > 0 ? `WHERE ${kondisi.join(' AND ')}` : '';

  const { rows } = await getPool().query(
    `SELECT p.*, k.nama_kategori
     FROM produk p
     JOIN kategori k ON p.id_kategori = k.id_kategori
     ${whereClause}
     ORDER BY p.nama_produk ASC`,
    nilai
  );
  return rows;
}

export async function ambilProdukById(idProduk) {
  const { rows } = await getPool().query(
    `SELECT p.*, k.nama_kategori
     FROM produk p
     JOIN kategori k ON p.id_kategori = k.id_kategori
     WHERE p.id_produk = $1
     LIMIT 1`,
    [idProduk]
  );
  return rows[0] || null;
}

export async function ambilProdukByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const { rows } = await getPool().query(
    `SELECT p.*, k.nama_kategori
     FROM produk p
     JOIN kategori k ON p.id_kategori = k.id_kategori
     WHERE p.id_produk = ANY($1::int[])`,
    [ids]
  );
  return rows;
}

export async function simpanPesanKontak(nama, email, pesan) {
  await getPool().query(
    `INSERT INTO pesan_masuk (nama, email, pesan) VALUES ($1, $2, $3)`,
    [nama, email, pesan]
  );
}

/* =========================================================
 * ADMIN — LOGIN
 * ========================================================= */

export async function ambilAdminByUsername(username) {
  const { rows } = await getPool().query(
    `SELECT * FROM admin WHERE username = $1 LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

/* =========================================================
 * ADMIN — CRUD KATEGORI
 * ========================================================= */

export async function tambahKategori(namaKategori, slug) {
  const { rows } = await getPool().query(
    `INSERT INTO kategori (nama_kategori, slug) VALUES ($1, $2) RETURNING *`,
    [namaKategori, slug]
  );
  return rows[0];
}

export async function hapusKategori(idKategori) {
  await getPool().query(`DELETE FROM kategori WHERE id_kategori = $1`, [idKategori]);
}

/* =========================================================
 * ADMIN — CRUD PRODUK
 * ========================================================= */

export async function tambahProduk(data) {
  const { rows } = await getPool().query(
    `INSERT INTO produk (id_kategori, nama_produk, deskripsi, harga, stok, gambar, is_unggulan)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.id_kategori,
      data.nama_produk,
      data.deskripsi,
      data.harga,
      data.stok,
      data.gambar || 'placeholder.svg',
      data.is_unggulan || false,
    ]
  );
  return rows[0];
}

export async function updateProduk(idProduk, data) {
  const { rows } = await getPool().query(
    `UPDATE produk SET
       id_kategori = $1,
       nama_produk = $2,
       deskripsi = $3,
       harga = $4,
       stok = $5,
       gambar = $6,
       is_unggulan = $7
     WHERE id_produk = $8
     RETURNING *`,
    [
      data.id_kategori,
      data.nama_produk,
      data.deskripsi,
      data.harga,
      data.stok,
      data.gambar || 'placeholder.svg',
      data.is_unggulan || false,
      idProduk,
    ]
  );
  return rows[0] || null;
}

export async function hapusProduk(idProduk) {
  await getPool().query(`DELETE FROM produk WHERE id_produk = $1`, [idProduk]);
}

/* =========================================================
 * TRANSAKSI (checkout)
 * ========================================================= */

function buatKodeTransaksi() {
  const waktu = Date.now().toString(36).toUpperCase();
  const acak = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TRX-${waktu}${acak}`;
}

/**
 * Buat transaksi baru dari isi keranjang. Harga & nama produk selalu
 * diambil ulang dari database (bukan dari input client) supaya tidak bisa
 * dimanipulasi, lalu stok produk dikurangi sesuai jumlah yang dibeli.
 */
export async function buatTransaksi({ pembeli, itemKeranjang }) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const idProdukList = itemKeranjang.map((it) => it.id_produk);
    const { rows: produkList } = await client.query(
      `SELECT * FROM produk WHERE id_produk = ANY($1::int[])`,
      [idProdukList]
    );
    const produkMap = new Map(produkList.map((p) => [p.id_produk, p]));

    let totalHarga = 0;
    const itemSiap = [];

    for (const it of itemKeranjang) {
      const produk = produkMap.get(it.id_produk);
      if (!produk) continue;

      const jumlah = Math.max(1, parseInt(it.jumlah, 10) || 1);
      const subtotal = Number(produk.harga) * jumlah;
      totalHarga += subtotal;

      itemSiap.push({
        id_produk: produk.id_produk,
        nama_produk: produk.nama_produk,
        harga_satuan: produk.harga,
        jumlah,
        subtotal,
      });
    }

    if (itemSiap.length === 0) {
      throw new Error('Tidak ada produk valid pada keranjang.');
    }

    const kodeTransaksi = buatKodeTransaksi();

    const { rows: trxRows } = await client.query(
      `INSERT INTO transaksi
         (kode_transaksi, nama_pembeli, email_pembeli, telepon_pembeli, alamat_pembeli, catatan, total_harga)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        kodeTransaksi,
        pembeli.nama,
        pembeli.email,
        pembeli.telepon,
        pembeli.alamat,
        pembeli.catatan || null,
        totalHarga,
      ]
    );
    const transaksi = trxRows[0];

    for (const item of itemSiap) {
      await client.query(
        `INSERT INTO transaksi_item (id_transaksi, id_produk, nama_produk, harga_satuan, jumlah, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          transaksi.id_transaksi,
          item.id_produk,
          item.nama_produk,
          item.harga_satuan,
          item.jumlah,
          item.subtotal,
        ]
      );

      await client.query(
        `UPDATE produk SET stok = GREATEST(stok - $1, 0) WHERE id_produk = $2`,
        [item.jumlah, item.id_produk]
      );
    }

    await client.query('COMMIT');

    return { transaksi, items: itemSiap };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function ambilTransaksiById(idTransaksi) {
  const { rows: trxRows } = await getPool().query(
    `SELECT * FROM transaksi WHERE id_transaksi = $1 LIMIT 1`,
    [idTransaksi]
  );
  const transaksi = trxRows[0];
  if (!transaksi) return null;

  const { rows: items } = await getPool().query(
    `SELECT * FROM transaksi_item WHERE id_transaksi = $1 ORDER BY id_item ASC`,
    [idTransaksi]
  );

  return { ...transaksi, items };
}

export async function ambilSemuaTransaksi(filter = {}) {
  const { kataKunci, status, dari, sampai } = filter;
  const kondisi = [];
  const nilai = [];

  if (kataKunci && kataKunci.trim() !== '') {
    nilai.push(`%${kataKunci.trim()}%`);
    kondisi.push(
      `(kode_transaksi ILIKE $${nilai.length} OR nama_pembeli ILIKE $${nilai.length} OR telepon_pembeli ILIKE $${nilai.length})`
    );
  }

  if (status && status.trim() !== '') {
    nilai.push(status.trim());
    kondisi.push(`status = $${nilai.length}`);
  }

  if (dari && dari.trim() !== '') {
    nilai.push(dari.trim());
    kondisi.push(`dibuat_pada >= $${nilai.length}::date`);
  }

  if (sampai && sampai.trim() !== '') {
    nilai.push(sampai.trim());
    kondisi.push(`dibuat_pada < ($${nilai.length}::date + interval '1 day')`);
  }

  const whereClause = kondisi.length > 0 ? `WHERE ${kondisi.join(' AND ')}` : '';

  const { rows } = await getPool().query(
    `SELECT * FROM transaksi ${whereClause} ORDER BY dibuat_pada DESC`,
    nilai
  );

  if (rows.length === 0) return rows;

  const idList = rows.map((t) => t.id_transaksi);
  const { rows: semuaItem } = await getPool().query(
    `SELECT * FROM transaksi_item WHERE id_transaksi = ANY($1::int[]) ORDER BY id_item ASC`,
    [idList]
  );

  const itemPerTransaksi = new Map();
  for (const item of semuaItem) {
    if (!itemPerTransaksi.has(item.id_transaksi)) {
      itemPerTransaksi.set(item.id_transaksi, []);
    }
    itemPerTransaksi.get(item.id_transaksi).push(item);
  }

  return rows.map((t) => ({
    ...t,
    items: itemPerTransaksi.get(t.id_transaksi) || [],
  }));
}

export async function updateStatusTransaksi(idTransaksi, status) {
  await getPool().query(
    `UPDATE transaksi SET status = $1 WHERE id_transaksi = $2`,
    [status, idTransaksi]
  );
}

/* =========================================================
 * DASHBOARD ADMIN & LAPORAN PENJUALAN
 * ========================================================= */

export async function ambilRingkasanDashboard() {
  const pool = getPool();

  const [{ rows: totalProduk }, { rows: totalKategori }, { rows: totalTransaksi }, { rows: totalPendapatan }, { rows: produkTerlaris }] =
    await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total FROM produk`),
      pool.query(`SELECT COUNT(*)::int AS total FROM kategori`),
      pool.query(`SELECT COUNT(*)::int AS total FROM transaksi`),
      pool.query(`SELECT COALESCE(SUM(total_harga), 0) AS total FROM transaksi WHERE status <> 'dibatalkan'`),
      pool.query(`
        SELECT nama_produk, SUM(jumlah)::int AS total_terjual
        FROM transaksi_item
        GROUP BY nama_produk
        ORDER BY total_terjual DESC
        LIMIT 5
      `),
    ]);

  return {
    totalProduk: totalProduk[0].total,
    totalKategori: totalKategori[0].total,
    totalTransaksi: totalTransaksi[0].total,
    totalPendapatan: Number(totalPendapatan[0].total),
    produkTerlaris,
  };
}