import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CounselingApplication } from '@/lib/models';
import { getUserId } from '@/lib/server-utils';
import {
  createTransactionId,
  getCallbackBaseUrl,
  initiateEasebuzzPayment,
} from '@/lib/easebuzz';

type InitiatePaymentBody = {
  applicationId: string;
  amount: number | string;
  productinfo: string;
  fullName: string;
  email: string;
  phone: string;
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as InitiatePaymentBody;
    const { applicationId, amount, productinfo, fullName, email, phone } = body;

    if (!applicationId || !amount || !productinfo || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'applicationId, amount, productinfo, fullName, email, and phone are required' },
        { status: 400 }
      );
    }

    const application = await CounselingApplication.findOne({ applicationId, userId });
    if (!application) {
      return NextResponse.json({ error: 'Counseling application not found' }, { status: 404 });
    }

    if (application.paymentStatus === 'COMPLETED') {
      return NextResponse.json({ error: 'This application fee is already paid.' }, { status: 400 });
    }

    const parsedAmount = Number.parseFloat(String(amount));
    const expectedAmount = Number.parseFloat(String(application.feeAmount));

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    if (parsedAmount.toFixed(2) !== expectedAmount.toFixed(2)) {
      return NextResponse.json({ error: 'Payment amount does not match application fee' }, { status: 400 });
    }

    const txnid = createTransactionId();
    const callbackUrl = `${getCallbackBaseUrl(request)}/api/payments/easebuzz/callback`;
    const firstname = String(fullName).trim().split(/\s+/)[0] || 'Applicant';
    const normalizedPhone = String(phone).replace(/\D/g, '').slice(-10);

    if (normalizedPhone.length !== 10) {
      return NextResponse.json({ error: 'A valid 10-digit phone number is required for payment.' }, { status: 400 });
    }

    application.razorpayOrderId = txnid;
    application.paymentMethod = 'EASEBUZZ';
    application.paymentStatus = 'PENDING';
    await application.save();

    const payment = await initiateEasebuzzPayment({
      txnid,
      amount: parsedAmount,
      productinfo: String(productinfo).slice(0, 100),
      firstname,
      email: String(email).trim(),
      phone: normalizedPhone,
      surl: callbackUrl,
      furl: callbackUrl,
      udf1: applicationId,
      udf2: userId,
    });

    return NextResponse.json({
      message: 'Easebuzz payment initiated',
      paymentUrl: payment.paymentUrl,
      txnid: payment.txnid,
      amount: payment.amount,
    });
  } catch (error) {
    console.error('Easebuzz initiate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
