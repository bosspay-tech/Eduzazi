'use client';

import Navbar from "@/components/navbar";
import { FileText, Send, Ban, AlertCircle, UserCheck, HelpCircle, Mail, RotateCcw } from "lucide-react";

export default function RefundPolicyPage() {
  const sections = [
    {
      icon: <FileText className="h-6 w-6 text-violet-600" />,
      title: "Nature of Services",
      content: "All fees paid on this platform are for professional educational counseling, university admissions advisory, document evaluation, and match analysis. We do not sell or ship physical products."
    },
    {
      icon: <Send className="h-6 w-6 text-violet-600" />,
      title: "Booking & Advisor Assignment",
      content: "Upon successful fee payment, an expert study abroad advisor will be assigned to evaluate your academic profile, and invitation details to schedule strategy calls will be sent to your email."
    },
    {
      icon: <Ban className="h-6 w-6 text-violet-600" />,
      title: "Non-Refundable Policy",
      content: "Because profiling and evaluation preparation starts immediately after payment, all advisory payments are final. No refunds, cancellations, or exchanges are offered after advisor assignment or transcript review starts."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-violet-600" />,
      title: "Exceptional Cases",
      content: "Refund considerations are only made for technical system errors resulting in duplicate payments for the same service, or if the platform is unable to allocate an advisor within 5 business days."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-violet-600" />,
      title: "Candidate Responsibility",
      content: "Candidates are responsible for providing authentic academic transcripts, qualification scores, and target course information. Incomplete or forged documentation will lead to service termination without refund."
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-violet-600" />,
      title: "Support & Assistance",
      content: "If you experience technical issues scheduling your strategy call or uploading academic records, please contact our support team in Cochin."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-foreground">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 border-b border-slate-100 py-16 md:py-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <RotateCcw className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-800">
                Policy Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Refund & Cancellation Policy
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Please review our policy regarding counseling fees, advisor allocation, and refund eligibility.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-8">
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>
                  At <strong>EDUCAZIONE STUDY ABROAD PRIVATE LIMITED</strong>, we aim to provide high-quality admissions assistance and counseling advisor support. Below is our detailed refund and cancellation policy.
                </p>
                <p className="text-xs text-slate-400">
                  Last updated: June 9, 2026
                </p>
              </div>

              <div className="border-t border-slate-200 my-8" />

              <div className="space-y-8">
                {sections.map((section, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-violet-100">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 my-8" />

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Contact Support</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      For any refund queries or support issues, reach our Cochin office:
                    </p>
                    <div className="space-y-1 text-sm font-semibold text-slate-800">
                      <p>📧 Email: <a href="mailto:support@educazi.com" className="text-violet-600 hover:underline">support@educazi.com</a></p>
                      <p>📞 Phone: <a href="tel:+918129870556" className="text-violet-600 hover:underline">+91 8129870556</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
