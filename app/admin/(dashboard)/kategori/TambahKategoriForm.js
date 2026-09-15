'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { tambahKategoriAction } from './actions';

const initialState = { status: null, pesan: '' };

function TombolTambah() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Menyimpan...' : 'Tambah Kategori'}
    </button>
  );
}

export default function TambahKategoriForm() {
  const [state, formAction] = useFormState(tambahKategoriAction, initialState);

  return (
    <form className="admin-form admin-form-inline" action={formAction} key={state.pesan || 'awal'}>
      {state.status && (
        <div className={`alert ${state.status === 'sukses' ? 'alert-sukses' : 'alert-gagal'}`}>
          {state.pesan}
        </div>
      )}

      <label htmlFor="nama_kategori">Nama Kategori</label>
      <input
        type="text"
        id="nama_kategori"
        name="nama_kategori"
        placeholder="Contoh: Sarung Bantal Rajut"
        required
      />

      <TombolTambah />
    </form>
  );
}
