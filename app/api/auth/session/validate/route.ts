import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId } = await request.json();

    if (!userId || !sessionId) {
      return NextResponse.json({ error: 'User ID and session ID are required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId).select('activeSessionId').lean();
    if (!user || user.activeSessionId !== sessionId) {
      return NextResponse.json({ error: 'Session revoked' }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
