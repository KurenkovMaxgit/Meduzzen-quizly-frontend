import { cookies } from 'next/headers';
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/utils/api-constants';
import { HttpError, HttpExceptionResponse } from '@/interfaces/common/api-exception-interface';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/cookie-constants';

const serverFetch = async (url: string, options?: RequestInit & { timeout?: number }) => {
  const { timeout = REQUEST_TIMEOUT, ...restOptions } = options || {};

  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  const cookiesToForward = [];
  if (accessToken) cookiesToForward.push(`${ACCESS_TOKEN_KEY}=${accessToken}`);
  if (refreshToken) cookiesToForward.push(`${REFRESH_TOKEN_KEY}=${refreshToken}`);

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
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...restOptions.headers,
      },
      signal: AbortSignal.timeout(timeout),
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response ${response.status} from ${API_BASE_URL}${url}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
      }
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

export default serverFetch;
