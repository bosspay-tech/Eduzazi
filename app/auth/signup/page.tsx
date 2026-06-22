'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Loader2, ArrowLeft, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/navbar';
import { apiUrl } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Name Validation
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long.');
      return;
    }
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!nameRegex.test(name.trim())) {
      toast.error('Name can only contain letters, spaces, hyphens, and dots.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Password Complexity Validation
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase (capital) letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error('Password must contain at least one special character.');
      return;
    }

    // Phone Validation (if provided)
    let fullPhone = '';
    if (phone.trim()) {
      if (phone.length !== 10) {
        toast.error('Phone number must be exactly 10 digits.');
        return;
      }
      fullPhone = `+91${phone}`;
    }

    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email,
          phone: fullPhone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Signup failed');
        return;
      }

      toast.success(data.message || 'Account created successfully! Please check your email to verify your account.');
      router.push('/auth/login');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Create Account</h1>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">Join us to start your global advisory journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-violet-500" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[0-9]/g, ''))}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 text-xs sm:text-sm text-slate-700 transition"
                  />
                </div>
              </div>

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

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-violet-500" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-violet-500" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 text-xs sm:text-sm text-slate-700 transition"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  className="mt-1 mr-2 rounded border-slate-200 text-violet-600 focus:ring-violet-600/20 cursor-pointer"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="text-xs font-semibold text-slate-500 leading-normal">
                  I agree to the{' '}
                  <Link href="/terms" className="text-violet-600 hover:text-violet-750 font-bold hover:underline" target="_blank">
                    Terms & Conditions
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-xs sm:text-sm text-slate-500 font-semibold mt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-violet-600 font-black hover:text-violet-750 hover:underline">
                Sign in
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
