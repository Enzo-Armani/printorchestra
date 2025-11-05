import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  const { SITE_PASSWORD, JWT_SECRET } = process.env;

  // 1. Check if the password is correct
  if (password !== SITE_PASSWORD) {
    return new Response('Invalid password', { status: 401 });
  }

  // 2. Get the secret for signing the token
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  const secret = new TextEncoder().encode(JWT_SECRET);

  try {
    // 3. Create a JWT token
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // Token expires in 1 day
      .sign(secret);

    // 4. Set the token in a secure, httpOnly cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating JWT:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}