'use client';

import { useState, useTransition } from 'react';
import { updateStatusTransaksiAction } from './actions';

const LABEL_STATUS = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export default function UbahStatusSelect({ idTransaksi, statusAwal }) {
  const [status, setStatus] = useState(statusAwal);
  const [gagal, setGagal] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const statusBaru = e.target.value;
    const statusSebelumnya = status;

    setStatus(statusBaru);
    setGagal(false);

    startTransition(async () => {
      try {
        await updateStatusTransaksiAction(idTransaksi, statusBaru);
      } catch (err) {
        console.error('Gagal mengubah status transaksi:', err);
        setStatus(statusSebelumnya);
        setGagal(true);
      }
    });
  }

  return (
    <div className="status-select-wrap">
      <select
        className={`status-pill status-select status-${status}`}
        value={status}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Ubah status transaksi"
      >
        {Object.entries(LABEL_STATUS).map(([nilai, label]) => (
          <option key={nilai} value={nilai}>
            {label}
          </option>
        ))}
      </select>
      {isPending && <span className="status-select-info">Menyimpan...</span>}
      {gagal && <span className="status-select-error">Gagal, coba lagi.</span>}
    </div>
  );
}