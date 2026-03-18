import { NextRequest, NextResponse } from 'next/server';
import { addUser, findUserByEmail } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      role: 'user' as const,
      name
    };

    // Add user to storage
    addUser(newUser);

    // Auto-login after registration
    const token = Buffer.from(JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      timestamp: Date.now()
    })).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
