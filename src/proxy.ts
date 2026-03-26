import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleLocalization } from '@/middlewares/localization';

export function proxy(request: NextRequest) {
  const localizationResponse = handleLocalization(request);

  if (localizationResponse) {
    return localizationResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
