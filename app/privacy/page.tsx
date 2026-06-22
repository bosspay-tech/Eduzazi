'use client';

import Navbar from "@/components/navbar";
import { Shield, Database, Settings, Lock, Share2, User, Mail, Sparkles } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Shield className="h-6 w-6 text-violet-600" />,
      title: "Overview",
      content: "This Privacy Policy explains how we collect, use, and protect your information when you use our platform for study abroad admissions assistance and counseling advisory services."
    },
    {
      icon: <Database className="h-6 w-6 text-violet-600" />,
      title: "Information We Collect",
      list: [
        "Personal details: name, email address, phone number, and mailing address.",
        "Academic records: qualification status, GPAs, institutional transcripts, target country, and course preferences.",
        "Application essays: Statement of Purpose (SOP) drafts, CV information, and counseling session inputs.",
        "Transaction details: consultation fee payments, invoice status, and booking history."
      ]
    },
    {
      icon: <Settings className="h-6 w-6 text-violet-600" />,
      title: "How We Use Your Information",
      list: [
        "To assign and schedule strategy calls with specialist educational advisors.",
        "To evaluate your academic background and matches for study destinations.",
        "To process admission processing fees and invoice records.",
        "To deliver support and check progress on pending university admissions."
      ]
    },
    {
      icon: <Lock className="h-6 w-6 text-violet-600" />,
      title: "Security & Payments",
      content: "All enrollment fees are processed securely via encrypted channels through payment partners. We do not store financial or credit card numbers on our local databases."
    },
    {
      icon: <Share2 className="h-6 w-6 text-violet-600" />,
      title: "Data Disclosures",
      content: "We only share candidate details with authorized university admissions officers (upon student approval) and payment handlers. Your database records are never sold."
    },
    {
      icon: <User className="h-6 w-6 text-violet-600" />,
      title: "Candidate Rights",
      list: [
        "Access, update, or correct your academic profiles.",
        "Request full deletion of your counseling logs and database profile.",
        "Opt out of notifications regarding university application statuses."
      ]
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
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-800">
                Privacy Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Understand how we collect, process, and safeguard your data.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-8">
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>
                  At <strong>EDUCAZIONE STUDY ABROAD PRIVATE LIMITED</strong>, protecting student and user privacy is of utmost importance to us. Below is our updated Privacy Policy outlining how your data is handled.
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
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Privacy Support</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      If you have questions about this policy or request data deletion, contact us at:
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
