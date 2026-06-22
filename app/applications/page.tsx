'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { Loader, Calendar, CreditCard, ChevronRight, GraduationCap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiUrl, authHeaders } from '@/lib/api';

interface Application {
  applicationId: string;
  serviceName: string;
  fullName: string;
  email: string;
  feeAmount: number;
  paymentStatus: string;
  applicationStatus: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/counseling/applications'), {
        headers: authHeaders(session?.user?.id),
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve applications feed');
      }

      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Unable to fetch your counseling applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchApplications();
    }
  }, [status, session]);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader className="h-12 w-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground text-sm font-semibold">Loading applications feed...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-100">
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            {paymentStatus}
          </span>
        );
    }
  };

  const getStatusBadge = (appStatus: string) => {
    switch (appStatus) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
            Under Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            Reviewing Profile
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
            Call Scheduled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-100">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-50 text-slate-650 border border-slate-150">
            {appStatus}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-100 via-slate-50 to-indigo-50/20 border-b border-slate-200 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <GraduationCap className="h-12 w-12 text-violet-650 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-black text-gray-950">
            My Counseling Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
            Track submitted profiles, payment statements, and counseling scheduling progress.
          </p>
        </div>
      </section>

      {/* Main Table Feed */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 rounded-3xl bg-white border border-slate-200" />
            <div className="h-20 rounded-3xl bg-white border border-slate-200" />
            <div className="h-20 rounded-3xl bg-white border border-slate-200" />
          </div>
        ) : applications.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-800">Submitted Applications</h3>
              <button
                onClick={fetchApplications}
                className="p-2 text-slate-400 hover:text-violet-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-450 uppercase tracking-wider">
                    <th className="px-6 py-4">Application Details</th>
                    <th className="px-6 py-4">Date Submitted</th>
                    <th className="px-6 py-4">Form Fee</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Admissions Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-gray-700">
                  {applications.map((app) => (
                    <tr key={app.applicationId} className="hover:bg-slate-50/20 transition-colors">
                      {/* Service & ID */}
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="font-extrabold text-gray-900 text-sm leading-snug">{app.serviceName}</p>
                          <p className="text-[10px] font-bold text-slate-400 break-all select-all font-mono">{app.applicationId}</p>
                        </div>
                      </td>

                      {/* Created date */}
                      <td className="px-6 py-5 whitespace-nowrap text-slate-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{new Date(app.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}</span>
                        </div>
                      </td>

                      {/* Fee Price */}
                      <td className="px-6 py-5 whitespace-nowrap text-gray-900">
                        ₹{Math.round(app.feeAmount).toLocaleString('en-IN')}
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        {getPaymentBadge(app.paymentStatus)}
                      </td>

                      {/* Admissions Status */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        {getStatusBadge(app.applicationStatus)}
                      </td>

                      {/* Link Action */}
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        {app.paymentStatus === 'COMPLETED' ? (
                          <Link
                            href={`/services/confirmation/${app.applicationId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-violet-650 hover:text-violet-750 bg-violet-50 hover:bg-violet-100/60 border border-violet-100 px-3.5 py-2 rounded-xl transition"
                          >
                            <span>Receipt</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/services/pay?applicationId=${app.applicationId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl shadow-sm transition"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>Pay Fee</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[32px] p-8 max-w-lg mx-auto flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mb-5 border border-violet-100/30">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">No counseling applications found</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
              You haven't submitted any admissions or school counseling forms yet. Get started by exploring our services.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Explore Services
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
