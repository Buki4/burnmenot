import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.BAND_PASSWORD || '1234'; // Default '1234' for local testing if forgot to add env

    if (password === correctPassword) {
      const cookieStore = await cookies();
      cookieStore.set('burnmenot_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
