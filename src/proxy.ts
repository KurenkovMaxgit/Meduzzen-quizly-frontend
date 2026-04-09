import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth0 } from '@/lib/auth0';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './utils/cookie-constants';
import { HOME_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE } from './utils/router-constants';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/auth')) {
    return await auth0.middleware(request);
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  let hasAuth0Session = false;
  try {
    const session = await auth0.getSession();
    hasAuth0Session = !!session?.user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {}

  const customAccessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const customRefreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;

  const hasAuth = hasAuth0Session || !!customAccessToken || !!customRefreshToken;

  const isPublicAuthRoute = pathname.includes(SIGNIN_ROUTE) || pathname.includes(SIGNUP_ROUTE);

  if (hasAuth && isPublicAuthRoute) {
    return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
  }

  if (!hasAuth && !isPublicAuthRoute) {
    return NextResponse.redirect(new URL(SIGNIN_ROUTE, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
