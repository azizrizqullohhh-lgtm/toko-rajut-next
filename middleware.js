import { NextResponse } from 'next/server';

// Middleware berjalan di Edge Runtime, yang TIDAK mendukung modul
// Node.js 'crypto' secara penuh. Jadi di sini kita hanya melakukan
// pengecekan cepat "apakah cookie session ada atau tidak" sebagai lapisan
// pertama. Verifikasi tanda tangan session yang sesungguhnya dilakukan di
// app/admin/(dashboard)/layout.js, yang berjalan di Node.js runtime dan
// bisa memakai lib/auth.js dengan aman.
const SESSION_COOKIE_NAME = 'admin_session';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
