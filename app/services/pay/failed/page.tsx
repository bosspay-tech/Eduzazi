'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { AlertCircle, Loader, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiUrl, authHeaders } from '@/lib/api';
import { startEasebuzzPayment } from '@/lib/payments';

const FAILURE_MESSAGES: Record<string, string> = {
  invalid_hash: 'Payment verification failed. Please try again or contact support.',
  transaction_mismatch: 'Transaction details did not match. Please retry payment.',
  payment_failed: 'Payment was not completed. No amount was charged.',
  userCancelled: 'You cancelled the payment before completion.',
  cancelled: 'Payment was cancelled before completion.',
  failure: 'Payment could not be processed by the bank or gateway.',
};

function getFailureMessage(reason: string | null): string {
  if (!reason) {
    return 'Payment could not be completed. Please try again.';
  }
  return FAILURE_MESSAGES[reason] || 'Payment could not be completed. Please try again.';
}

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const applicationId = searchParams.get('applicationId');
  const reason = searchParams.get('reason');
  const message = getFailureMessage(reason);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!applicationId || !session?.user?.id) return;

    setRetrying(true);
    try {
      const res = await fetch(apiUrl(`/api/counseling/applications/${applicationId}`), {
        headers: authHeaders(session.user.id),
      });

      if (!res.ok) {
        throw new Error('Failed to load application details');
      }

      const data = await res.json();
      const app = data.application;

      await startEasebuzzPayment(
        {
          applicationId: app.applicationId,
          amount: app.feeAmount,
          productinfo: app.serviceName,
          fullName: app.fullName,
          email: app.email,
          phone: app.phone,
        },
        session.user.id
      );
    } catch (error) {
      console.error('Easebuzz payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Could not start payment');
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mx-auto">
            <AlertCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
              Payment Failed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Payment Not Completed</h1>
            <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
          </div>

          {applicationId && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Application Reference</p>
              <p className="text-sm font-bold text-gray-800 break-all">{applicationId}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            {applicationId && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={retrying}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 disabled:opacity-60 transition cursor-pointer"
              >
                {retrying ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {retrying ? 'Opening Easebuzz...' : 'Try Payment Again'}
              </button>
            )}
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition"
            >
              <Home className="h-4 w-4" />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <div className="flex items-center justify-center py-24">
            <Loader className="h-10 w-10 text-violet-600 animate-spin" />
          </div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
