import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // In a stateless JWT setup, the client is responsible for deleting the token.
    // This endpoint is here for completeness and can be extended later (e.g., with a token blocklist).
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
