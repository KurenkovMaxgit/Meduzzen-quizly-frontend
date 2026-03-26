import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'uk'];
const defaultLocale = 'en';

export function handleLocalization(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';

  const pathnameHasLocale = locales.some(
    (locale) => url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  if (process.env.NODE_ENV === 'development') {
    if (host.includes('.ua')) {
      return NextResponse.rewrite(new URL(`/uk${url.pathname}${url.search}`, request.url));
    }

    return NextResponse.rewrite(new URL(`/en${url.pathname}${url.search}`, request.url));
  }

  url.pathname = `/${defaultLocale}${url.pathname}`;

  return NextResponse.redirect(url);
}
