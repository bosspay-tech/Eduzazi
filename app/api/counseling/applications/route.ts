import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CounselingApplication } from '@/lib/models';
import { getUserId } from '@/lib/server-utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await CounselingApplication.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Get counseling applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
