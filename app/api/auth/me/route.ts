import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Decode token (in production, verify JWT)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is not too old (7 days)
      if (Date.now() - decoded.timestamp > 60 * 60 * 24 * 7 * 1000) {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name
        }
      });
    } catch (decodeError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
