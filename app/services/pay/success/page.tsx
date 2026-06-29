'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { CheckCircle2, Loader, ArrowRight, Home, FileText } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  useEffect(() => {
    if (applicationId) {
      const timer = setTimeout(() => {
        router.push(`/services/confirmation/${applicationId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [applicationId, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
              Payment Successful
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Thank You!</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your counseling registration fee was received successfully. A confirmation email has been sent to your inbox.
            </p>
          </div>

          {applicationId && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Application Reference</p>
              <p className="text-sm font-bold text-gray-800 break-all">{applicationId}</p>
            </div>
          )}

          <p className="text-xs text-slate-400 font-semibold">Redirecting to confirmation page...</p>

          <div className="flex flex-col gap-3 pt-2">
            {applicationId && (
              <Link
                href={`/services/confirmation/${applicationId}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition"
              >
                <FileText className="h-4 w-4" />
                View Confirmation
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
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
      <PaymentSuccessContent />
    </Suspense>
  );
}
