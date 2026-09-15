import { NextResponse } from 'next/server';
import { ambilProdukByIds } from '../../../lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids') || '';

  const ids = idsParam
    .split(',')
    .map((v) => parseInt(v, 10))
    .filter((v) => Number.isInteger(v) && v > 0);

  if (ids.length === 0) {
    return NextResponse.json({ produk: [] });
  }

  try {
    const produk = await ambilProdukByIds(ids);
    return NextResponse.json({ produk });
  } catch (err) {
    console.error('Gagal mengambil produk untuk keranjang:', err);
    return NextResponse.json(
      { produk: [], error: 'Gagal mengambil data produk.' },
      { status: 500 }
    );
  }
}
