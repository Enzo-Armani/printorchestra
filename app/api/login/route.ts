import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  const { SITE_PASSWORD, JWT_SECRET } = process.env;

  // 1. Check if the password is correct
  if (password !== SITE_PASSWORD) {
    // Return a 401 Unauthorized response
    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Get the secret for signing the token
  if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const secret = new TextEncoder().encode(JWT_SECRET);

  try {
    // 3. Create a JWT token
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // Token expires in 1 day
      .sign(secret);

    // 4. Create the success response
    const response = NextResponse.json({ success: true });

    // 5. Set the token in a secure, httpOnly cookie on the response
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    // 6. Return the response with the cookie
    return response;

  } catch (error) {
    console.error('Error creating JWT:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}