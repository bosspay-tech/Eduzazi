import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CounselingApplication } from '@/lib/models';
import { getUserId } from '@/lib/server-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const application = await CounselingApplication.findOne({ applicationId: id, userId });
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Get counseling application detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
