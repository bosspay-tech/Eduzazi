// TermsOfService.jsx (Digital Course Platform)
import React from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <div className="text-sm text-slate-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>{" "}
            <span className="text-slate-600">/</span>{" "}
            <span className="font-semibold text-white">Terms of Service</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Terms of Service
          </h1>
        </div>

        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          {/* Agreement */}
          <section>
            <h2 className="text-sm font-bold text-white">Agreement</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              By accessing or purchasing from this platform, you agree to these
              Terms. If you do not agree, please do not use our services.
            </p>
          </section>

          {/* Digital Products */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Digital Products & Access
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              All courses offered are digital products delivered in the form of
              downloadable PDFs or online access. Upon successful payment, you
              will receive instant access to the purchased content.
            </p>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Payments & Confirmation
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Access is granted only after successful payment confirmation.
              </li>
              <li>
                We reserve the right to cancel or restrict access in case of
                suspected fraud or misuse.
              </li>
              <li>All prices are subject to change without prior notice.</li>
            </ul>
          </section>

          {/* No Refund */}
          <section>
            <h2 className="text-sm font-bold text-white">No Refund Policy</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Due to the nature of digital products,{" "}
              <span className="font-semibold text-red-400">
                all purchases are final and non-refundable
              </span>
              . Once access is granted, cancellations, refunds, or exchanges are
              not permitted.
            </p>
          </section>

          {/* License */}
          <section>
            <h2 className="text-sm font-bold text-white">
              License & Usage Restrictions
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Courses are licensed for personal, non-commercial use only.
              </li>
              <li>
                You may not share, resell, distribute, or upload course
                materials to any platform.
              </li>
              <li>
                Unauthorized sharing or piracy may result in account suspension
                or legal action.
              </li>
            </ul>
          </section>

          {/* User Responsibility */}
          <section>
            <h2 className="text-sm font-bold text-white">
              User Responsibilities
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Provide accurate account and contact information.</li>
              <li>Maintain confidentiality of your account credentials.</li>
              <li>Do not attempt to hack, misuse, or disrupt the platform.</li>
            </ul>
          </section>

          {/* IP */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Intellectual Property
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              All course materials, content, branding, and design are owned by
              us or licensed. You may not copy, reproduce, or distribute any
              content without permission.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Limitation of Liability
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We are not liable for any indirect or consequential damages
              arising from the use of our platform or content.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-sm font-bold text-white">Changes to Terms</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We may update these Terms at any time. Continued use of the
              platform means you accept the updated Terms.
            </p>
          </section>

          {/* Law */}
          <section>
            <h2 className="text-sm font-bold text-white">Governing Law</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              These Terms are governed by the laws of India. Any disputes shall
              be subject to the jurisdiction of{" "}
              <span className="font-semibold text-slate-100">
                Haryana, India
              </span>
              .
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              For any questions, contact{" "}
              <span className="font-semibold text-cyan-300">
                support@educazi.com
              </span>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
