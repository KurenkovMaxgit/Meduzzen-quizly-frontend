import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleLocalization } from '@/middlewares/localization';
import { auth0 } from '@/lib/auth0';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './utils/cookie-constants';

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

  const isPublicAuthRoute = pathname.includes('/signin') || pathname.includes('/signup');

  if (hasAuth && isPublicAuthRoute) {
    const homeUrl = new URL('/', request.url);

    return NextResponse.redirect(homeUrl);
  }

  if (!hasAuth && !isPublicAuthRoute) {
    const signInUrl = new URL('/signin', request.url);

    return NextResponse.redirect(signInUrl);
  }

  return handleLocalization(request) || NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
