export function formatRupiah(angka) {
  const n = Number(angka) || 0;
  return 'Rp ' + n.toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

// Halaman admin (mis. daftar transaksi) dirender di server (Server Component),
// jadi toLocaleString() tanpa timeZone akan memakai timezone server (biasanya
// UTC), bukan WIB, dan jamnya jadi mundur ~7 jam dari waktu Indonesia.
// Fungsi ini selalu memaksa timezone Asia/Jakarta supaya jam yang tampil
// konsisten, siapa pun/di mana pun server-nya di-deploy.
export function formatTanggalWaktu(tanggal) {
  return new Date(tanggal).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';
}

// Versi ringkas untuk struk cetak: "04 Sep 2026 • 13:13" (tanpa "WIB").
export function formatTanggalWaktuRingkas(tanggal) {
  const bagian = new Date(tanggal).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return bagian.replace(', ', ' • ').replace('.', ':');
}
