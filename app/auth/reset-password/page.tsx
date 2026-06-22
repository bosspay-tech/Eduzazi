'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader, ArrowLeft, Key, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/navbar';
import { apiUrl } from '@/lib/api';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [otp, setOtp] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Prefill OTP if token is present in URL
  useEffect(() => {
    if (tokenParam) {
      setOtp(tokenParam);
    }
  }, [tokenParam]);

  // Password Validation Checks
  const isLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const isPasswordStrong = isLengthValid && hasUppercase && hasNumber && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }

    if (!isPasswordStrong) {
      toast.error('Password does not meet all strength requirements.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: otp, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Password reset successful!');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-md border border-border/80 rounded-3xl shadow-xl transition-all duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
        {emailParam && (
          <p className="text-primary font-semibold text-xs mt-1">
            Resetting password for: <span className="underline">{emailParam}</span>
          </p>
        )}
        <p className="text-muted-foreground text-sm mt-2">
          Enter the 6-digit OTP code sent to your email along with your new secure password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Code */}
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-1.5">
            Verification Code (6-Digit OTP)
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-accent" />
            <input
              id="otp"
              type="text"
              maxLength={6}
              required
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-accent" />
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            />
          </div>

          {/* Password Requirements Checklist */}
          <div className="mt-3 p-3 bg-secondary/40 rounded-xl border border-border/60 text-xs space-y-1.5">
            <p className="font-semibold text-foreground">Password requirements:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                {isLengthValid ? <Check className="h-3.5 w-3.5 text-green-600" /> : <X className="h-3.5 w-3.5 text-red-500" />}
                <span className={isLengthValid ? 'text-green-700' : 'text-muted-foreground'}>8+ Characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasUppercase ? <Check className="h-3.5 w-3.5 text-green-600" /> : <X className="h-3.5 w-3.5 text-red-500" />}
                <span className={hasUppercase ? 'text-green-700' : 'text-muted-foreground'}>1 Capital Letter</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasNumber ? <Check className="h-3.5 w-3.5 text-green-600" /> : <X className="h-3.5 w-3.5 text-red-500" />}
                <span className={hasNumber ? 'text-green-700' : 'text-muted-foreground'}>1 Number</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasSpecialChar ? <Check className="h-3.5 w-3.5 text-green-600" /> : <X className="h-3.5 w-3.5 text-red-500" />}
                <span className={hasSpecialChar ? 'text-green-700' : 'text-muted-foreground'}>1 Special Character</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-accent" />
            <input
              id="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isPasswordStrong || !confirmPassword || otp.length !== 6}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-accent disabled:opacity-50 font-semibold transition shadow-md hover:shadow-lg mt-2"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-bg-soft-white via-surface-blush to-secondary flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-md border border-border/80 rounded-3xl shadow-xl text-center">
              <Loader className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">Loading password reset form...</p>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
      <div className="py-6 border-t border-border text-center text-xs text-muted-foreground bg-white/50">
        &copy; {new Date().getFullYear()} Crawl Cores Solution. All rights reserved.
      </div>
    </div>
  );
}
