// TermsOfService.jsx (dark electronics theme)
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
          <section>
            <h2 className="text-sm font-bold text-white">Agreement</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              By using this website, you agree to these Terms. If you do not
              agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Products & Pricing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We try to display accurate product information and pricing.
              However, errors may occur. We reserve the right to correct errors
              and cancel orders if necessary.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Orders & Payments</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Orders are confirmed only after successful payment or COD
                confirmation (if available).
              </li>
              <li>
                We may cancel orders for suspected fraud, incorrect pricing, or
                stock unavailability.
              </li>
              <li>
                In case of cancellation, refunds will be processed as
                applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              User Responsibilities
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                You agree to provide accurate contact and delivery information.
              </li>
              <li>
                You will not misuse the site, attempt hacks, or violate
                applicable laws.
              </li>
              <li>
                You are responsible for maintaining confidentiality of your
                account (if applicable).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Returns & Refunds</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Returns and refunds are governed by our Returns & Refund Policy.
              Please review it for details and eligibility.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              Intellectual Property
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              All content on this website (images, logos, text, design) is owned
              by us or licensed. You may not copy, reproduce, or redistribute
              without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              Limitation of Liability
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              To the maximum extent permitted by law, we are not liable for
              indirect or incidental damages arising from use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Governing Law</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              These Terms are governed by the laws of India. Any disputes shall
              be subject to the jurisdiction of{" "}
              <span className="font-semibold text-slate-100">
                your city/state
              </span>
              .
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              For questions, email{" "}
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
