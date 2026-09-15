'use client';

import { useFormState, useFormStatus } from 'react-dom';

function TombolSimpan({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </button>
  );
}

export default function ProdukForm({ action, kategoriList, produk, labelTombol }) {
  const initialState = { status: null, errors: {} };
  const [state, formAction] = useFormState(action, initialState);
  const errors = state.errors || {};

  return (
    <form className="admin-form" action={formAction}>
      {state.status === 'error' && (
        <div className="alert alert-gagal">{state.pesan || 'Terjadi kesalahan.'}</div>
      )}

      <label htmlFor="nama_produk">Nama Produk</label>
      <input
        type="text"
        id="nama_produk"
        name="nama_produk"
        defaultValue={produk?.nama_produk || ''}
        placeholder="Contoh: Sweater Rajut Motif Kabel"
      />
      {errors.nama_produk && <span className="field-error">{errors.nama_produk}</span>}

      <label htmlFor="id_kategori">Kategori</label>
      <select id="id_kategori" name="id_kategori" defaultValue={produk?.id_kategori || ''}>
        <option value="" disabled>
          -- Pilih kategori --
        </option>
        {kategoriList.map((k) => (
          <option key={k.id_kategori} value={k.id_kategori}>
            {k.nama_kategori}
          </option>
        ))}
      </select>
      {errors.id_kategori && <span className="field-error">{errors.id_kategori}</span>}

      <label htmlFor="deskripsi">Deskripsi</label>
      <textarea
        id="deskripsi"
        name="deskripsi"
        rows={4}
        defaultValue={produk?.deskripsi || ''}
        placeholder="Ceritakan bahan, ukuran, dan keunggulan produk"
      />

      <div className="admin-form-row">
        <div>
          <label htmlFor="harga">Harga (Rp)</label>
          <input
            type="number"
            id="harga"
            name="harga"
            min="0"
            step="500"
            defaultValue={produk?.harga || ''}
            placeholder="150000"
          />
          {errors.harga && <span className="field-error">{errors.harga}</span>}
        </div>

        <div>
          <label htmlFor="stok">Stok</label>
          <input
            type="number"
            id="stok"
            name="stok"
            min="0"
            defaultValue={produk?.stok ?? 0}
            placeholder="10"
          />
          {errors.stok && <span className="field-error">{errors.stok}</span>}
        </div>
      </div>

      <label htmlFor="gambar">Nama File Gambar</label>
      <input
        type="text"
        id="gambar"
        name="gambar"
        defaultValue={produk?.gambar || ''}
        placeholder="nama-file.jpg (taruh filenya di public/images/produk/)"
      />

      <label className="admin-checkbox">
        <input type="checkbox" name="is_unggulan" defaultChecked={produk?.is_unggulan || false} />
        Tampilkan sebagai produk unggulan
      </label>

      <TombolSimpan label={labelTombol} />
    </form>
  );
}
