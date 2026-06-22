import Link from 'next/link';
import { ShieldCheck, FileText, Zap, Lock, Mail, Phone, Clock, Landmark } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 text-foreground py-16 border-t border-slate-200 print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand and Registered Office */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-black text-lg text-violet-600 tracking-wider">
              EDUCAZIONE STUDY ABROAD PRIVATE LIMITED
            </h3>
            <div className="text-muted-foreground text-sm space-y-3 leading-relaxed">
              <div className="flex items-start gap-2">
                <Landmark className="h-4 w-4 text-violet-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Registered Office:</p>
                  <p className="mt-0.5">Bhageeratha Square, First floor</p>
                  <p>No C 021 67/1717 (old no 41/3197)</p>
                  <p>Banerji Road, Kacheripady</p>
                  <p>Cochin - 682018, Kerala, India</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="h-4 w-4 text-violet-500 flex-shrink-0" />
                <a href="tel:+918129870556" className="hover:text-violet-600 transition font-semibold">
                  +91 8129870556
                </a>
              </div>
              <p className="font-bold text-slate-700 text-xs tracking-wider bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5 inline-block">
                GST REG: 32AAJCE2888C1ZQ
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-extrabold mb-4 text-slate-800 text-xs uppercase tracking-widest border-b border-slate-200 pb-2">
              Services & Support
            </h3>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li>
                <Link href="/services" className="hover:text-violet-600 hover:translate-x-0.5 transition-all inline-block duration-200">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-violet-600 hover:translate-x-0.5 transition-all inline-block duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-violet-600 hover:translate-x-0.5 transition-all inline-block duration-200">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-violet-600 hover:translate-x-0.5 transition-all inline-block duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-violet-600 hover:translate-x-0.5 transition-all inline-block duration-200">
                  My Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Legal */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h3 className="font-extrabold mb-4 text-slate-800 text-xs uppercase tracking-widest border-b border-slate-200 pb-2">
                Customer Care
              </h3>
              <div className="text-muted-foreground text-sm space-y-2.5 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-violet-500" />
                  <a href="mailto:support@educazi.com" className="hover:text-violet-600 transition font-bold text-slate-700">
                    support@educazi.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-violet-500" />
                  <span>Mon–Sat • 10:00 AM – 6:00 PM</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-extrabold mb-3 text-slate-800 text-xs uppercase tracking-widest border-b border-slate-100 pb-1">
                Company Legal
              </h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground text-sm font-medium">
                <li>
                  <Link href="/privacy" className="hover:text-violet-600 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <span className="text-slate-300">|</span>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-violet-600 transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <span className="text-slate-300">|</span>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-violet-600 transition">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Badges / Trust indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-slate-200/80 mb-8 text-center bg-white/50 backdrop-blur-sm rounded-2xl px-4 shadow-sm border border-slate-150">
          <div className="flex flex-col items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xs mt-2 text-slate-800">Quality Placement Support</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xs mt-2 text-slate-800">GST Invoices Provided</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xs mt-2 text-slate-800">Quick Consultant Match</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm">
              <Lock className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xs mt-2 text-slate-800">100% Secure Checkout</span>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-xs space-y-2">
          <p>&copy; {new Date().getFullYear()} EDUCAZIONE STUDY ABROAD PRIVATE LIMITED. All rights reserved.</p>
          <p className="text-[10px] text-muted-foreground/60 tracking-wider">UPI / Cards / Net Banking Accepted Securely</p>
        </div>
      </div>
    </footer>
  );
}
