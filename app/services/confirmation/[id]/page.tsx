'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import { Loader, CheckCircle2, Calendar, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiUrl, authHeaders } from '@/lib/api';

interface Application {
  applicationId: string;
  serviceName: string;
  fullName: string;
  email: string;
  phone: string;
  feeAmount: number;
  paymentStatus: string;
  createdAt: string;
  razorpayPaymentId?: string;
  paymentMethod: string;
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: session, status } = useSession();
  const [application, setApplication] = useState<Application | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(apiUrl(`/api/counseling/applications/${id}`), {
          headers: authHeaders(session?.user?.id),
        });

        if (!res.ok) {
          throw new Error('Failed to retrieve application details');
        }

        const data = await res.json();
        setApplication(data.application);
      } catch (error) {
        console.error('Error fetching application confirmation:', error);
        toast.error('Unable to fetch confirmation details');
      } finally {
        setLoading(false);
      }
    };

    if (id && status === 'authenticated' && session?.user?.id) {
      fetchApplication();
    }
  }, [id, status, session]);

  if (!mounted || status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader className="h-12 w-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground text-sm font-semibold">Generating confirmation profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-foreground print:bg-white print:text-black">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 print:py-0">
        <div className="bg-white rounded-3xl border border-slate-200/85 shadow-sm p-6 sm:p-10 text-center space-y-8 print:space-y-0 print:border-none print:shadow-none print:p-0">
          
          {/* Success CheckCircle Header */}
          <div className="space-y-3 print:space-y-1 print:hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100/30 print:hidden">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <span className="text-[10px] font-black text-emerald-650 uppercase tracking-widest bg-emerald-50 border border-emerald-100/50 px-3.5 py-1 rounded-full">
              Registration Fee Confirmed
            </span>
            <h1 className="text-3xl font-extrabold text-gray-950 mt-4 leading-none">Counseling Confirmed!</h1>
            <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">
              Your profile details have been saved, and your application is placed in queue. A confirmation receipt has been sent to your email.
            </p>
          </div>

          {/* Onboarding steps checklist */}
          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 text-left space-y-4 print:hidden">
            <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-violet-600" />
              Your Onboarding Roadmap
            </h4>
            
            <div className="space-y-4 pt-1">
              {[
                {
                  step: "Step 1",
                  title: "Advisor Portfolio Review",
                  desc: "Our target admissions team evaluates your educational profile transcripts (usually takes 12-18 hours).",
                },
                {
                  step: "Step 2",
                  title: "Expert Advisor Match",
                  desc: "We assign a counselor specialized in your target destination country or selected course path.",
                },
                {
                  step: "Step 3",
                  title: "Consultation Call Invitation",
                  desc: "Check your email inbox or dashboard for a meeting invite link to schedule your live strategy call.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-xs font-black text-violet-650 bg-violet-100 px-2 py-0.5 rounded-lg h-fit min-w-[50px] text-center border border-violet-150">{item.step}</span>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-gray-850">{item.title}</h5>
                    <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice receipt summary */}
          <div className="text-left border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h4 className="font-extrabold text-sm text-gray-900 border-b border-slate-100 pb-3 flex justify-between items-center">
              <span>Receipt Invoice</span>
              <span className="text-xs font-semibold text-slate-400">Date: {new Date(application.createdAt).toLocaleDateString('en-IN')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Application ID</span>
                <span className="font-bold text-gray-850 break-all">{application.applicationId}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Purchased</span>
                <span className="font-bold text-gray-850">{application.serviceName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Name</span>
                <span className="font-bold text-gray-850">{application.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Email</span>
                <span className="font-bold text-gray-850">{application.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Phone</span>
                <span className="font-bold text-gray-850">{application.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transaction ID</span>
                <span className="font-bold text-gray-850 break-all">{application.razorpayPaymentId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Method</span>
                <span className="font-bold text-gray-850">{application.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Status</span>
                <span className={`font-bold ${application.paymentStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {application.paymentStatus}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Registration Fee Paid</span>
              <span className="text-xl font-black text-gray-950">₹{Math.round(application.feeAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 print:hidden">
            <Link
              href="/applications"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl font-bold transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              Track Applications
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 border border-slate-250 bg-white text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              <FileText className="h-4.5 w-4.5" />
              Print Receipt
            </button>
            
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-6 py-3 text-slate-500 hover:text-slate-750 font-bold transition"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
