'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Loader, ArrowRight, Sparkles, Key } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/navbar';
import { apiUrl } from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const effectRan = useRef(false);

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'otp-input'>(
    token ? 'loading' : 'otp-input'
  );
  const [errorMessage, setErrorMessage] = useState('');
  
  // OTP Verification Form States
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Resend Email States
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  useEffect(() => {
    if (!token || effectRan.current) return;
    
    // Prevent double invocation in React strict mode
    effectRan.current = true;

    const verifyToken = async () => {
      try {
        const response = await fetch(apiUrl('/api/auth/verify-email'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          toast.success(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'The verification link is invalid or has expired.');
          toast.error(data.error || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An error occurred during verification. Please try again.');
        toast.error('Network error during email verification.');
      }
    };

    verifyToken();
  }, [token]);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the full 6-digit OTP code.');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch(apiUrl('/api/auth/verify-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        toast.success(data.message || 'Email verified successfully!');
      } else {
        toast.error(data.error || 'Invalid or expired OTP code.');
        setErrorMessage(data.error || 'Invalid or expired OTP code.');
        setStatus('error');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error('Please enter your email address.');
      return;
    }

    setResendLoading(true);
    try {
      const response = await fetch(apiUrl('/api/auth/resend-verification'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendSuccess(true);
        toast.success(data.message || 'Verification code sent successfully!');
      } else {
        toast.error(data.error || 'Failed to resend verification link.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-md border border-border/80 rounded-3xl shadow-xl transition-all duration-300">
      {/* Loading state (Link click auto-verification) */}
      {status === 'loading' && (
        <div className="text-center py-6">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 animate-ping absolute" />
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center relative">
              <Loader className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Verifying Link</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we verify your secure link and activate your account.
          </p>
        </div>
      )}

      {/* Success state */}
      {status === 'success' && (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 text-green-600">
            <CheckCircle className="h-10 w-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Email Verified!</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Thank you! Your email address has been successfully verified. Your account is now active and ready to use.
          </p>
          <Link
            href="/auth/login"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Go to Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="py-2">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 text-red-600">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h2>
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          </div>

          <div className="border-t border-border my-6 pt-6 flex flex-col gap-4">
            <button
              onClick={() => {
                setStatus('otp-input');
                setErrorMessage('');
              }}
              className="w-full py-2.5 text-sm font-semibold border border-primary text-primary rounded-xl hover:bg-primary/5 transition text-center"
            >
              Try entering OTP Code manually
            </button>
            
            <button
              onClick={() => {
                setShowResendForm(true);
                setStatus('otp-input');
              }}
              className="w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition text-center"
            >
              Resend verification email
            </button>
          </div>
        </div>
      )}

      {/* OTP Input and Resend state */}
      {status === 'otp-input' && (
        <div className="py-2">
          {!showResendForm ? (
            /* OTP form */
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 text-primary">
                  <Key className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Enter Verification Code</h2>
                <p className="text-muted-foreground text-sm">
                  We sent a 6-digit OTP code to your registered email address.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-center text-sm font-medium text-foreground mb-4">
                    Verification Code (OTP)
                  </label>
                  <input
                    id="otp"
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setOtp(val);
                    }}
                    className="w-full text-center tracking-[1em] text-2xl font-bold py-3.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-accent disabled:opacity-50 font-semibold transition"
                >
                  {otpLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-8">
                Didn't receive the code?{' '}
                <button
                  onClick={() => setShowResendForm(true)}
                  className="text-primary font-semibold hover:underline"
                >
                  Request a new one
                </button>
              </p>
            </div>
          ) : (
            /* Resend Form */
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 text-primary">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Resend Code</h2>
                <p className="text-muted-foreground text-sm">
                  Enter your email address below to receive a new 6-digit OTP.
                </p>
              </div>

              {resendSuccess ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-sm">
                    A new 6-digit verification code has been sent. Please check your inbox and spam folder.
                  </div>
                  <button
                    onClick={() => {
                      setResendSuccess(false);
                      setShowResendForm(false);
                      setOtp('');
                    }}
                    className="w-full py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-accent transition"
                  >
                    Enter Verification Code
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-accent" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-accent disabled:opacity-50 font-semibold transition"
                  >
                    {resendLoading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      'Send OTP Code'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResendForm(false)}
                    className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition text-center"
                  >
                    Back to Enter Code
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-bg-soft-white via-surface-blush to-secondary flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-md border border-border/80 rounded-3xl shadow-xl text-center">
              <Loader className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">Loading email verification...</p>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
