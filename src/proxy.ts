import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleLocalization } from '@/middlewares/localization';
import { ACCESS_TOKEN_KEY } from './utils/cookie-constants';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  const isPublicAuthRoute = pathname.includes('/signin') || pathname.includes('/signup');
  const isAuth0Callback =
    request.nextUrl.searchParams.has('code') && request.nextUrl.searchParams.has('state');

  if (!token && !isAuth0Callback && !isPublicAuthRoute) {
    const signInUrl = new URL('/signin', request.url);

    return NextResponse.redirect(signInUrl);
  }

  if (token && isPublicAuthRoute) {
    const homeUrl = new URL('/', request.url);

    return NextResponse.redirect(homeUrl);
  }

  return handleLocalization(request) || NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
