import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'uk'];
const defaultLocale = 'en';

function detectLocale(request: NextRequest): string {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  const localeFromPath = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (localeFromPath) return localeFromPath;

  if (process.env.NODE_ENV === 'development' && host.includes('.ua')) {
    return 'uk';
  }

  return defaultLocale;
}

export function handleLocalization(request: NextRequest) {
  const url = request.nextUrl;
  const currentLocale = detectLocale(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-current-lang', currentLocale);

  const pathnameHasLocale = locales.some(
    (locale) => url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (process.env.NODE_ENV === 'development') {
    return NextResponse.rewrite(
      new URL(`/${currentLocale}${url.pathname}${url.search}`, request.url),
      { request: { headers: requestHeaders } },
    );
  }

  url.pathname = `/${defaultLocale}${url.pathname}`;

  return NextResponse.redirect(url);
}
