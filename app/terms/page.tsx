'use client';

import Navbar from "@/components/navbar";
import { ScrollText, BookOpen, CreditCard, Ban, Lock, UserCheck, ShieldCheck, AlertCircle, RefreshCw, Scale, Mail } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <ScrollText className="h-6 w-6 text-violet-600" />,
      title: "Agreement",
      content: "By accessing or booking counseling services on this platform, you agree to these Terms. If you do not agree, please do not use our services."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-violet-600" />,
      title: "Counseling Services & Delivery",
      content: "All services offered are professional study abroad evaluations and advisor match consultations. Service is considered delivered once advisor allocation is completed and profiling assessment commences."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-violet-600" />,
      title: "Service Fees & Invoicing",
      list: [
        "Consultation and matching processes commence only after successful fee payment validation.",
        "We reserve the right to decline applications or matching if the profile information provided is fraudulent.",
        "All counseling service pricing plans are subject to change without prior notice."
      ]
    },
    {
      icon: <Ban className="h-6 w-6 text-violet-600" />,
      title: "Non-Refundable Policy",
      content: "Due to the resource-intensive profiling, assessment, and advisory match work starting immediately, all counseling fees are non-refundable once service registration is confirmed."
    },
    {
      icon: <Lock className="h-6 w-6 text-violet-600" />,
      title: "Advisory & Profile Restrictions",
      list: [
        "Admissions guides, mock questions, and matching reports are licensed for personal, non-commercial use only.",
        "You may not distribute, share, or resell matching reports or advisor insights to other platforms or students.",
        "Sharing evaluation materials without consent may result in account termination and legal action."
      ]
    },
    {
      icon: <UserCheck className="h-6 w-6 text-violet-600" />,
      title: "User Responsibilities",
      list: [
        "Provide accurate academic, financial, and qualification records.",
        "Maintain the confidentiality of advisor matching documents and credentials.",
        "Do not upload forged certificates, transcripts, or test scores."
      ]
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-violet-600" />,
      title: "Intellectual Property",
      content: "All matching criteria, assessment tests, branding, reports, and advisory materials are owned by us. No reproducing or copying is permitted."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-violet-600" />,
      title: "Limitation of Liability",
      content: "We provide university matches and advisory assistance, but do not guarantee final university admission or visa approvals, which depend entirely on university panels and immigration officers."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-violet-600" />,
      title: "Changes to Terms",
      content: "We may update these Terms at any time. Continued use of our portal after changes represents acceptance of the new Terms."
    },
    {
      icon: <Scale className="h-6 w-6 text-violet-600" />,
      title: "Governing Law",
      content: "These Terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the courts in Cochin, Kerala, India."
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
              <Scale className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-800">
                Legal Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our platform.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-8">
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>
                  Welcome to our platform. These Terms of Service govern your use of our website and educational counseling and advisory services.
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
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {section.title}
                      </h2>
                      {section.content && (
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {section.content}
                        </p>
                      )}
                      {section.list && (
                        <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 leading-relaxed mt-2 pl-2">
                          {section.list.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      )}
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
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Legal Support</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      If you have questions about these Terms, reach us at:
                    </p>
                    <div className="space-y-1 text-sm font-semibold text-slate-800">
                      <p>📧 Email: <a href="mailto:support@educazi.com" className="text-violet-600 hover:underline">support@educazi.com</a></p>
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
