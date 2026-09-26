import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ambilTransaksiById } from '../../../../../lib/queries';
import { SESSION_COOKIE_NAME, readSessionToken } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const username = readSessionToken(token);
  if (!username) {
    return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 });
  }

  const idTransaksi = parseInt(params.id, 10);
  if (!idTransaksi) {
    return NextResponse.json({ error: 'ID transaksi tidak valid.' }, { status: 400 });
  }

  const transaksi = await ambilTransaksiById(idTransaksi);
  if (!transaksi) {
    return NextResponse.json({ error: 'Transaksi tidak ditemukan.' }, { status: 404 });
  }

  return NextResponse.json(transaksi);
}