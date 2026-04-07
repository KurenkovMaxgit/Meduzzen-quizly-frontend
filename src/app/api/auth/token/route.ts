import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    const { token } = await auth0.getAccessToken();

    return NextResponse.json({ token });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 });
  }
}
