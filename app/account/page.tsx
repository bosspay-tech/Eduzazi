'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { User, Mail, Phone, Lock, Check, ChevronRight, Loader } from 'lucide-react';
import Navbar from '@/components/navbar';
import { apiUrl } from '@/lib/api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile(session.user.id);
    }
  }, [status, session?.user?.id, router]);

  const fetchProfile = async (userId: string) => {
    setLoading(true);

    try {
      const res = await fetch(apiUrl(`/api/auth/profile/${userId}`));
      if (!res.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await res.json();
      setProfile(data.user);
      setFormState({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Unable to load account details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.password && formState.password !== formState.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!session?.user?.id) {
      toast.error('Unable to update profile.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(apiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          name: formState.name,
          phone: formState.phone,
          password: formState.password || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to update profile');
      }

      toast.success('Account settings saved.');
      setProfile(data.user);
      setFormState((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      window.location.reload();
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-r from-secondary to-secondary py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <User className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Account Settings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your profile, update contact details, and secure your account.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 rounded-3xl bg-secondary" />
            <div className="h-20 rounded-3xl bg-secondary" />
            <div className="h-20 rounded-3xl bg-secondary" />
          </div>
        ) : session?.user ? (
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <section className="rounded-[32px] border border-border bg-white p-8 shadow-sm">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Personal profile
                </p>
                <h2 className="mt-4 text-3xl font-bold text-foreground">Your details</h2>
                <p className="mt-2 text-muted-foreground">
                  Keep your account information up to date for a better shopping experience.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
                    <input
                      id="name"
                      type="text"
                      value={formState.name}
                      onChange={(event) => handleChange('name', event.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
                    <input
                      id="email"
                      type="email"
                      value={formState.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-3xl bg-secondary text-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
                    <input
                      id="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={(event) => handleChange('phone', event.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-4">Change Password</p>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
                      <input
                        id="password"
                        type="password"
                        value={formState.password}
                        onChange={(event) => handleChange('password', event.target.value)}
                        placeholder="Enter a new password"
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2 mt-4">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
                      <input
                        id="confirmPassword"
                        type="password"
                        value={formState.confirmPassword}
                        onChange={(event) => handleChange('confirmPassword', event.target.value)}
                        placeholder="Confirm your new password"
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-3xl hover:bg-accent disabled:bg-accent disabled:cursor-not-allowed transition font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </section>

            <aside className="rounded-[32px] border border-border bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-secondary text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Account summary</p>
                  <p className="text-sm text-muted-foreground">Your saved profile information at a glance.</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-foreground">
                <div className="rounded-3xl bg-background p-4 border border-border">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Email</p>
                  <p>{profile?.email ?? 'Loading...'}</p>
                </div>
                <div className="rounded-3xl bg-background p-4 border border-border">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Phone</p>
                  <p>{profile?.phone || 'Not added yet'}</p>
                </div>
                <div className="rounded-3xl bg-background p-4 border border-border">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">User ID</p>
                  <p className="break-all">{profile?.id ?? 'Loading...'}</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/applications"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-primary text-foreground rounded-3xl hover:bg-secondary transition font-medium"
                >
                  View Applications
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        ) : null}
      </main>
    </div>
  );
}
