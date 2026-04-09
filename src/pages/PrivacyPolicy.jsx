// PrivacyPolicy.jsx (Digital Courses Platform)
import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <div className="text-sm text-slate-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>{" "}
            <span className="text-slate-600">/</span>{" "}
            <span className="font-semibold text-white">Privacy Policy</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Privacy Policy
          </h1>
        </div>

        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          {/* Overview */}
          <section>
            <h2 className="text-sm font-bold text-white">Overview</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This Privacy Policy explains how we collect, use, and protect your
              information when you use our platform to purchase and access
              digital courses and downloadable materials (PDFs).
            </p>
          </section>

          {/* Info Collected */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Information We Collect
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Personal details: name, email address, phone number.</li>
              <li>
                Account data: login credentials, course enrollments, and access
                history.
              </li>
              <li>
                Transaction details: courses purchased, payment status, and
                billing info.
              </li>
              <li>
                Device & usage data: IP address, browser type, cookies, and
                analytics data.
              </li>
            </ul>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-sm font-bold text-white">
              How We Use Your Information
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>To provide access to purchased courses and PDF materials.</li>
              <li>To process payments and send purchase confirmations.</li>
              <li>To communicate important updates and support responses.</li>
              <li>To improve platform performance and user experience.</li>
              <li>To prevent fraud, unauthorized access, and piracy.</li>
            </ul>
          </section>

          {/* Digital Delivery */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Digital Content Access
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We may track access, downloads, and usage of course materials to
              ensure proper delivery and prevent unauthorized distribution of
              content.
            </p>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Payments & Security
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Payments are processed securely through third-party payment
              gateways. We do not store your card or sensitive payment details
              on our servers.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-sm font-bold text-white">Cookies</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We use cookies to enhance your experience, remember preferences,
              and analyze platform usage. You can disable cookies in your
              browser settings, but some features may not work properly.
            </p>
          </section>

          {/* Sharing */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Sharing of Information
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We may share your information with trusted third-party services
              such as payment gateways, email providers, and analytics tools. We
              do not sell your personal data.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-sm font-bold text-white">Data Security</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We implement industry-standard security measures to protect your
              data. However, no system is completely secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-sm font-bold text-white">Your Rights</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Access, update, or correct your personal information.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Opt out of promotional communications.</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              If you have any questions, contact{" "}
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
