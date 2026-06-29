import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CounselingApplication } from '@/lib/models';
import { sendCounselingConfirmationEmail } from '@/lib/email';
import { getEasebuzzConfig, verifyPaymentResponse } from '@/lib/easebuzz';
import { getBossPayBridge } from '@/lib/bosspay-bridge';
import { handleEasebuzzWebhook } from '@dpx/bridge-node';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function formDataToRecord(formData: FormData): Record<string, string> {
  const payload: Record<string, string> = {};
  formData.forEach((value, key) => {
    payload[key] = String(value);
  });
  return payload;
}

async function updateEducaziApplication(payload: Record<string, string>) {
  const applicationId = payload.udf1;
  if (!applicationId) return;

  await connectDB();
  const application = await CounselingApplication.findOne({ applicationId });
  if (!application) return;

  const paymentStatus = (payload.status || '').toLowerCase();
  if (paymentStatus === 'success' && application.paymentStatus !== 'COMPLETED') {
    application.paymentStatus = 'COMPLETED';
    application.applicationStatus = 'PENDING';
    application.paymentMethod = 'EASEBUZZ';
    application.razorpayPaymentId = payload.easepayid || payload.bank_ref_num || payload.txnid || '';
    application.razorpaySignature = payload.hash || '';
    await application.save();

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
    return;
  }

  if (paymentStatus && paymentStatus !== 'success' && paymentStatus !== 'pending') {
    application.paymentStatus = 'FAILED';
    application.paymentMethod = 'EASEBUZZ';
    await application.save();
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const payload = formDataToRecord(formData);
    const config = getEasebuzzConfig();

    const verification = verifyPaymentResponse(config, payload);
    if (!verification.valid) {
      return NextResponse.json({ ok: false, error: 'Invalid hash' }, { status: 400 });
    }

    await updateEducaziApplication(payload);

    if (process.env.BOSSPAY_BRIDGE_SECRET?.trim()) {
      try {
        const bridge = getBossPayBridge();
        const result = await handleEasebuzzWebhook(payload, {
          salt: config.salt,
          forwardCallback: (args) => bridge.forwardCallback(args),
        });
        return NextResponse.json({ ok: true, ...result });
      } catch (forwardErr) {
        console.warn('DollerpayX callback forward skipped:', forwardErr);
      }
    }

    return NextResponse.json({ ok: true, outcome: 'processed' });
  } catch (error) {
    console.error('Easebuzz webhook error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
