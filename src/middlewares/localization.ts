import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'uk'];
const defaultLocale = 'en';

export function handleLocalization(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';

  const localeInPath = locales.find(
    (locale) => url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`,
  );

  if (localeInPath) {
    const cleanPath = url.pathname.replace(`/${localeInPath}`, '') || '/';

    return NextResponse.redirect(new URL(`${cleanPath}${url.search}`, request.url));
  }

  let currentLocale = defaultLocale;
  const cookieLocale = request.cookies.get('QUIZLY_LANGUAGE')?.value;

  if (cookieLocale && locales.includes(cookieLocale)) {
    currentLocale = cookieLocale;
  } else if (process.env.NODE_ENV === 'development' && host.includes('.ua')) {
    currentLocale = 'uk';
  }

  const rewriteUrl = new URL(`/${currentLocale}${url.pathname}${url.search}`, request.url);

  return NextResponse.rewrite(rewriteUrl);
}
