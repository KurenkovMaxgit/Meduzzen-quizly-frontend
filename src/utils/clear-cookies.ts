'use server';

import { cookies } from 'next/headers';
import {
  ACTIVE_COMPANY_ID_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/utils/cookie-constants';

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACTIVE_COMPANY_ID_KEY);
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}
