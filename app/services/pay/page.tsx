'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import { Loader, Shield, Lock, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiUrl, authHeaders } from '@/lib/api';

interface Application {
  applicationId: string;
  serviceName: string;
  fullName: string;
  email: string;
  feeAmount: number;
  paymentStatus: string;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const applicationId = searchParams.get('applicationId');

  const [application, setApplication] = useState<Application | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI details
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const res = await fetch(apiUrl(`/api/counseling/applications/${applicationId}`), {
          headers: authHeaders(session?.user?.id),
        });
        if (!res.ok) {
          throw new Error('Failed to fetch application details');
        }
        const data = await res.json();
        setApplication(data.application);

        if (data.application.paymentStatus === 'COMPLETED') {
          toast.info('This application fee is already paid.');
          router.push(`/services/confirmation/${applicationId}`);
        }
      } catch (error) {
        console.error('Error fetching application details:', error);
        toast.error('Failed to load application details');
      } finally {
        setPageLoading(false);
      }
    };

    if (applicationId && status === 'authenticated' && session?.user?.id) {
      fetchApplicationDetails();
    }
  }, [applicationId, status, session, router]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || cardExpiry.length !== 5) {
        toast.error('Please enter expiry in MM/YY format.');
        return;
      }
      if (cardCvv.length !== 3) {
        toast.error('Please enter a 3-digit CVV.');
        return;
      }
      if (!cardName.trim()) {
        toast.error('Please enter cardholder name.');
        return;
      }
    } else {
      if (!upiId.includes('@') || upiId.trim().length < 5) {
        toast.error('Please enter a valid UPI ID (e.g. name@upi).');
        return;
      }
    }

    setLoading(true);

    // Simulated latency for high-fidelity loading overlays
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const response = await fetch(apiUrl('/api/counseling/pay'), {
        method: 'POST',
        headers: authHeaders(session?.user?.id),
        body: JSON.stringify({
          applicationId,
          paymentMethod: paymentMethod === 'card' ? 'CARD' : 'UPI',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Simulated transaction declined');
        return;
      }

      toast.success('Form fee processed successfully!');
      router.push(`/services/confirmation/${applicationId}`);
    } catch (error) {
      console.error('Processing transaction error:', error);
      toast.error('An error occurred during transaction processing.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || status === 'loading' || pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader className="h-12 w-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground text-sm font-semibold">Loading secure payment portal...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <Navbar />

      {loading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center flex-col text-white space-y-4">
          <Loader className="h-14 w-14 text-white animate-spin" />
          <h2 className="text-xl font-bold tracking-wide">Processing Secure Payment...</h2>
          <p className="text-sm text-slate-350 font-medium max-w-xs text-center">Do not close this page or press back. Contacting card issuer node...</p>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Progress Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest bg-violet-100/60 px-3 py-1 rounded-full border border-violet-200">Step 2 of 2</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Secure Gateway Checkout</h1>
            <p className="text-sm text-slate-500 mt-1">Complete your counseling registration fee payment.</p>
          </div>
          
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Modify Form
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Payment Methods & Input details */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Toggle Payment Methods */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="grid grid-cols-2 border-b border-slate-100">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-4 text-center font-bold text-sm flex items-center justify-center gap-2 border-r border-slate-100 cursor-pointer transition ${paymentMethod === 'card' ? 'bg-violet-50/50 text-violet-600 border-b-2 border-b-violet-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <CreditCard className="h-4 w-4" />
                  Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-4 text-center font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition ${paymentMethod === 'upi' ? 'bg-violet-50/50 text-violet-600 border-b-2 border-b-violet-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <CheckCircle className="h-4 w-4" />
                  UPI / NetBanking
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.replace(/[0-9]/g, ''))}
                          placeholder="e.g. John Doe"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Card Number *</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                            // Format with spacing: XXXX XXXX XXXX XXXX
                            setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 '));
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (val.length >= 2) {
                                setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
                              } else {
                                setCardExpiry(val);
                              }
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold transition text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">CVV / CVC *</label>
                          <input
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="***"
                            maxLength={3}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold transition text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">UPI Address / VPA *</label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value.trim())}
                          placeholder="e.g. applicant@okhdfc"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold transition"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        A transaction request will be triggered on your UPI application. Confirm to complete processing.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white rounded-xl hover:bg-violet-750 transition font-bold text-base shadow-md cursor-pointer"
                  >
                    <Lock className="h-4.5 w-4.5" />
                    Pay Registration Fee - ₹{Math.round(application.feeAmount).toLocaleString('en-IN')}
                  </button>
                </form>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center text-xs text-slate-450 font-bold">
              <Shield className="h-4.5 w-4.5 text-violet-600" />
              <span>PCI-DSS Secured End-to-End SSL Enforced Gateway</span>
            </div>

          </div>

          {/* Right Summary Panel */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <h3 className="font-bold text-gray-900 border-b border-slate-100 pb-3">Bill Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Application Reference</span>
                  <p className="text-sm font-extrabold text-gray-800 break-all">{application.applicationId}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Service Mode</span>
                  <p className="text-sm font-extrabold text-gray-800 leading-snug">{application.serviceName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Candidate Name</span>
                  <p className="text-sm font-extrabold text-gray-850">{application.fullName}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Registration Fee</span>
                  <span>₹{Math.round(application.feeAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-gray-900">
                  <span>Amount Payable</span>
                  <span>₹{Math.round(application.feeAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader className="h-12 w-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground text-sm font-semibold">Loading secure payment portal...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
