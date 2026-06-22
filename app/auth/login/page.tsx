'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowLeft, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/navbar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        if (result.error.includes('verification code has been sent')) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      } else if (result?.ok) {
        toast.success('Login successful!');
        router.push('/');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200/35 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/35 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100/30 mx-auto shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">Sign in to your admissions & advisory portal</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-violet-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 text-xs sm:text-sm text-slate-700 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-violet-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 text-xs sm:text-sm text-slate-700 transition"
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <label className="flex items-center text-slate-500 cursor-pointer select-none">
                  <input type="checkbox" className="mr-2 rounded border-slate-200 text-violet-600 focus:ring-violet-600/20 cursor-pointer" />
                  <span>Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-violet-600 hover:text-violet-750 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                <span className="px-3 bg-white text-slate-400">or</span>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 text-center text-xs font-bold text-violet-700 shadow-sm leading-relaxed">
              You must log in or create an account to book counseling services.
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-xs sm:text-sm text-slate-500 font-semibold mt-4">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-violet-600 font-black hover:text-violet-750 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
