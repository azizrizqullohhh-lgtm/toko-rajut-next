'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { updateStatusTransaksi } from '../../../../lib/queries';
import { SESSION_COOKIE_NAME, readSessionToken } from '../../../../lib/auth';

const STATUS_VALID = ['menunggu_konfirmasi', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];

export async function updateStatusTransaksiAction(idTransaksi, statusBaru) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const username = readSessionToken(token);
  if (!username) {
    throw new Error('Sesi admin tidak valid. Silakan login ulang.');
  }

  const id = parseInt(idTransaksi, 10);
  if (!id || !STATUS_VALID.includes(statusBaru)) {
    throw new Error('Data status tidak valid.');
  }

  await updateStatusTransaksi(id, statusBaru);
  revalidatePath('/admin/transaksi');
}