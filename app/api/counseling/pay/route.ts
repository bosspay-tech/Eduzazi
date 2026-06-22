import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CounselingApplication, User } from '@/lib/models';
import { getUserId } from '@/lib/server-utils';
import { sendCounselingConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, paymentMethod } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const application = await CounselingApplication.findOne({ applicationId, userId });
    if (!application) {
      return NextResponse.json({ error: 'Counseling application not found' }, { status: 404 });
    }

    // Update status
    application.paymentStatus = 'COMPLETED';
    application.applicationStatus = 'PENDING'; // Ready for review once paid
    application.paymentMethod = paymentMethod || 'ONLINE';
    application.razorpayPaymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await application.save();

    // Trigger Brevo confirmation email
    try {
      await sendCounselingConfirmationEmail(
        application.email,
        application.fullName,
        application.applicationId,
        application.serviceName,
        application.feeAmount,
        {
          phone: application.phone,
          dob: application.dob.toISOString(),
          highestQualification: application.highestQualification,
          gpaOrPercentage: application.gpaOrPercentage,
          preferredCountry: application.preferredCountry,
          preferredCourse: application.preferredCourse,
        }
      );
    } catch (emailErr) {
      console.error('Failed to send counseling confirmation email:', emailErr);
    }

    return NextResponse.json({
      message: 'Payment completed successfully',
      application,
    });
  } catch (error) {
    console.error('Payment callback processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
