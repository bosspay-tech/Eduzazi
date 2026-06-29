import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CounselingApplication } from '@/lib/models';
import { sendCounselingConfirmationEmail } from '@/lib/email';
import { getEasebuzzConfig, verifyPaymentResponse, type EasebuzzCallbackParams } from '@/lib/easebuzz';
import { getSiteBaseUrl } from '@/lib/site-url';

function normalizeCallbackParams(formData: FormData): EasebuzzCallbackParams {
  const params: EasebuzzCallbackParams = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });
  return params;
}

function redirectToResult(request: NextRequest, applicationId: string, status: 'success' | 'failed', reason?: string) {
  const path = status === 'success' ? '/services/pay/success' : '/services/pay/failed';
  const url = new URL(path, `${getSiteBaseUrl(request)}/`);
  url.searchParams.set('applicationId', applicationId);
  if (reason) {
    url.searchParams.set('reason', reason);
  }
  return NextResponse.redirect(url, { status: 303 });
}

async function processCallback(request: NextRequest, params: EasebuzzCallbackParams) {
  const applicationId = params.udf1;

  if (!applicationId) {
    return NextResponse.json({ error: 'Missing application reference' }, { status: 400 });
  }

  const config = getEasebuzzConfig();
  const verification = verifyPaymentResponse(config, params);

  if (!verification.valid) {
    return redirectToResult(request, applicationId, 'failed', 'invalid_hash');
  }

  await connectDB();

  const application = await CounselingApplication.findOne({ applicationId });
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  if (params.txnid && application.razorpayOrderId && params.txnid !== application.razorpayOrderId) {
    return redirectToResult(request, applicationId, 'failed', 'transaction_mismatch');
  }

  const paymentStatus = (params.status || '').toLowerCase();

  if (paymentStatus === 'success') {
    if (application.paymentStatus !== 'COMPLETED') {
      application.paymentStatus = 'COMPLETED';
      application.applicationStatus = 'PENDING';
      application.paymentMethod = 'EASEBUZZ';
      application.razorpayPaymentId = params.easepayid || params.bank_ref_num || params.txnid || '';
      application.razorpaySignature = params.hash || '';
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
    }

    return redirectToResult(request, applicationId, 'success');
  }

  application.paymentStatus = 'FAILED';
  application.paymentMethod = 'EASEBUZZ';
  await application.save();

  return redirectToResult(request, applicationId, 'failed', paymentStatus || 'payment_failed');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    return await processCallback(request, normalizeCallbackParams(formData));
  } catch (error) {
    console.error('Easebuzz callback error:', error);
    return NextResponse.json({ error: 'Payment callback processing failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const params: EasebuzzCallbackParams = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return await processCallback(request, params);
  } catch (error) {
    console.error('Easebuzz callback GET error:', error);
    return NextResponse.json({ error: 'Payment callback processing failed' }, { status: 500 });
  }
}
