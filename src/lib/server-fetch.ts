import { cookies } from 'next/headers';
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/utils/api-constants';
import { HttpError, HttpExceptionResponse } from '@/interfaces/common/api-exception-interface';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/cookie-constants';
import { auth0 } from '@/lib/auth0';

export const serverFetch = async (url: string, options?: RequestInit & { timeout?: number }) => {
  const { timeout = REQUEST_TIMEOUT, ...restOptions } = options || {};

  const cookieStore = await cookies();

  const customAccessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  const customRefreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  let auth0AccessToken = undefined;

  try {
    const session = await auth0.getSession();
    if (session) {
      const { token } = await auth0.getAccessToken();
      auth0AccessToken = token;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {}

  const finalAccessToken = auth0AccessToken || customAccessToken;

  const cookiesToForward = [];
  if (finalAccessToken) cookiesToForward.push(`${ACCESS_TOKEN_KEY}=${finalAccessToken}`);
  if (customRefreshToken) cookiesToForward.push(`${REFRESH_TOKEN_KEY}=${customRefreshToken}`);

  const cookieString = cookiesToForward.join('; ');

  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${restOptions.method?.toUpperCase() || 'GET'} ${API_BASE_URL}${url}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { Cookie: cookieString } : {}),
        ...restOptions.headers,
      },
      signal: AbortSignal.timeout(timeout),
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response ${response.status} from ${API_BASE_URL}${url}`);
    }

    if (!response.ok) {
      const errorData = (await response.json()) as HttpExceptionResponse;
      throw new HttpError({
        message: response.statusText,
        data: errorData,
      });
    }

    return response.json();
  } catch (error) {
    if (error instanceof HttpError) throw error;

    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        console.error('[API] Request timed out');
      } else if (error.name === 'AbortError') {
        console.error('[API] Request aborted by user');
      } else {
        console.error('[API] Error:', error);
      }
      throw error;
    }

    console.error('[API] Unknown error:', error);
    throw new Error('Unknown error', { cause: error });
  }
};
