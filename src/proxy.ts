import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleLocalization } from '@/middlewares/localization';
import { ACCESS_TOKEN_KEY } from './utils/cookie-constants';

export function proxy(request: NextRequest) {
  const localizationResponse = handleLocalization(request);

  const response = localizationResponse || NextResponse.next();

  //TODO: Remove when working on auth flow
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MOCK_AUTH_TOKEN) {
    response.cookies.set(ACCESS_TOKEN_KEY, process.env.NEXT_PUBLIC_MOCK_AUTH_TOKEN, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
