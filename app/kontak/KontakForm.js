'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { kirimPesanKontak } from './actions';

const initialState = { status: null };

function TombolKirim() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Mengirim...' : 'Kirim Pesan'}
    </button>
  );
}

export default function KontakForm() {
  const [state, formAction] = useFormState(kirimPesanKontak, initialState);

  return (
    <form className="kontak-form" action={formAction}>
      <h3>Kirim Pesan</h3>

      {state.status === 'sukses' && (
        <div className="alert alert-sukses">
          Terima kasih! Pesan kamu sudah kami terima.
        </div>
      )}
      {state.status === 'gagal' && (
        <div className="alert alert-gagal">
          Mohon isi semua kolom dengan benar (email harus valid).
        </div>
      )}
      {state.status === 'error' && (
        <div className="alert alert-gagal">
          Terjadi kendala menyimpan pesan. Coba lagi sebentar lagi.
        </div>
      )}

      <label htmlFor="nama">Nama</label>
      <input type="text" id="nama" name="nama" placeholder="Nama lengkap kamu" required />

      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" placeholder="email@contoh.com" required />

      <label htmlFor="pesan">Pesan</label>
      <textarea
        id="pesan"
        name="pesan"
        rows={5}
        placeholder="Tulis pertanyaan atau pesan kamu..."
        required
      />

      <TombolKirim />
    </form>
  );
}
