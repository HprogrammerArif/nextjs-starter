import { NextResponse } from 'next/server';
import { generateMockJwt, setSession } from '@/libs/Auth';

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();
    const body = rawBody as Record<string, string>;
    const { email, password } = body;

    if (!email || !email.includes('@') || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Invalid email or password (min 6 characters)' },
        { status: 400 },
      );
    }

    // In a real application, you would authenticate against your custom backend:
    // const response = await fetch(`${process.env.CUSTOM_BACKEND_URL}/api/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) {
    //   return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    // }
    // const { token } = await response.json();

    // For boilerplate demonstration, we generate a mock JWT:
    const token = generateMockJwt(email);

    await setSession(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
