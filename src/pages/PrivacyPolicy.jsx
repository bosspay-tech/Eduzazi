// PrivacyPolicy.jsx (dark electronics theme)
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
          <section>
            <h2 className="text-sm font-bold text-white">Overview</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This Privacy Policy explains how we collect, use, disclose, and
              protect your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              Information We Collect
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Personal details: name, phone number, email, shipping address.
              </li>
              <li>
                Order details: products purchased, order history, payment
                status.
              </li>
              <li>
                Device data: IP address, browser type, cookies, and usage
                analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              How We Use Your Information
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>To process orders, deliveries, returns, and refunds.</li>
              <li>To communicate order updates and support responses.</li>
              <li>
                To improve our website experience, products, and services.
              </li>
              <li>To prevent fraud and secure our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Cookies</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We use cookies to enhance your browsing experience and analyze
              site traffic. You can disable cookies from your browser settings,
              but some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              Sharing of Information
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We may share your information with trusted third parties only to
              fulfill services: payment providers, courier partners, and
              analytics tools. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Data Security</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We implement reasonable security measures to protect your data.
              However, no online transmission is 100% secure, so we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Your Rights</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Access, correct, or update your personal information.</li>
              <li>
                Request deletion of your account/data (subject to legal
                obligations).
              </li>
              <li>Opt out of marketing communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              If you have questions about this policy, contact{" "}
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
