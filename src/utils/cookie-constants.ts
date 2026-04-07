export const REFRESH_TOKEN_KEY = 'refreshToken';
export const REFRESH_TOKEN_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: 'lax' as const,
  path: '/',
};

export const ACCESS_TOKEN_KEY = 'accessToken';
export const ACCESS_TOKEN_OPTIONS: Cookies.CookieAttributes = {
  expires: 15 / (24 * 60),
  sameSite: 'lax' as const,
  path: '/',
};

export const ACTIVE_COMPANY_ID_KEY = 'activeCompanyId';
