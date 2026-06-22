'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 bg-background sticky top-0 z-50 print:hidden">
      <nav className="mx-auto max-w-7xl rounded-2xl glass-panel shadow-sm border border-slate-200/80 bg-white/80 backdrop-blur-md transition-all duration-300 hover:shadow-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with clean branding */}
            <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.01] shrink-0">
              <img
                src="/logo.png"
                alt="Educazione Logo"
                className="h-10 w-10 object-contain rounded-full shadow-sm bg-white"
              />
              <span className="font-extrabold text-[10px] sm:text-xs md:text-sm tracking-wider text-violet-600 uppercase transition-colors whitespace-nowrap">
                EDUCAZIONE STUDY ABROAD PRIVATE LIMITED
              </span>
            </Link>

            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center gap-6">
              {/* Services Link */}
              <Link
                href="/services"
                className={`px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-slate-100/50 ${isActive('/services')
                    ? 'text-violet-600'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Services
              </Link>

              {session?.user ? (
                <>
                  {/* My Applications Link */}
                  <Link
                    href="/applications"
                    className={`px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-slate-100/50 ${isActive('/applications')
                        ? 'text-violet-600'
                        : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    My Applications
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login Link */}
                  <Link
                    href="/auth/login"
                    className={`px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-slate-100/50 ${isActive('/auth/login')
                        ? 'text-violet-600'
                        : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Login
                  </Link>

                  {/* Sign up Button */}
                  <Link
                    href="/auth/signup"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex md:hidden items-center gap-1">
              {/* Mobile Menu Toggle */}
              <button
                className="p-2 text-foreground hover:text-violet-600 transition rounded-xl hover:bg-slate-100 cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-6 py-4 space-y-2 bg-white rounded-b-2xl animate-in fade-in slide-in-from-top duration-300">
            {/* Services */}
            <Link
              href="/services"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-bold ${isActive('/services')
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-foreground hover:bg-slate-50'
                }`}
              onClick={() => setMobileOpen(false)}
            >
              Services
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-bold ${isActive('/about')
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-foreground hover:bg-slate-50'
                }`}
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>

            {/* Contact us */}
            <Link
              href="/contact"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-bold ${isActive('/contact')
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-foreground hover:bg-slate-50'
                }`}
              onClick={() => setMobileOpen(false)}
            >
              Contact us
            </Link>

            <div className="border-t border-slate-100 my-2 pt-2" />

            {session?.user ? (
              <div className="space-y-1.5">
                <div className="px-4 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Logged in as <span className="text-violet-600">{session.user.name}</span>
                </div>
                <Link
                  href="/applications"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-bold ${isActive('/applications')
                      ? 'bg-violet-50 text-violet-600'
                      : 'text-foreground hover:bg-slate-50'
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  My Applications
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition text-sm font-semibold cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl transition font-bold text-sm text-slate-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition font-bold text-sm shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}