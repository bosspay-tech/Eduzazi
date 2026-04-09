// ReturnsRefunds.jsx (Digital Courses - No Refund Policy)
import React from "react";
import { Link } from "react-router-dom";

export default function ReturnsRefunds() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <div className="text-sm text-slate-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>{" "}
            <span className="text-slate-600">/</span>{" "}
            <span className="font-semibold text-white">
              Refund & Cancellation Policy
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Refund & Cancellation Policy
          </h1>
        </div>

        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          {/* Digital Product Nature */}
          <section>
            <h2 className="text-sm font-bold text-white">Nature of Product</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              All courses available on our platform are{" "}
              <span className="font-semibold text-slate-100">
                digital products
              </span>{" "}
              delivered in the form of downloadable PDFs or online access
              materials. No physical products are shipped.
            </p>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Delivery of Course Material
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Upon successful payment, course materials will be delivered{" "}
              <span className="font-semibold text-slate-100">instantly</span>{" "}
              via:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>Download link on the platform</li>
              <li>Email (if applicable)</li>
            </ul>
          </section>

          {/* No Refund Policy */}
          <section>
            <h2 className="text-sm font-bold text-white">No Refund Policy</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Due to the nature of digital content,{" "}
              <span className="font-semibold text-red-400">
                all purchases are final and non-refundable
              </span>
              . Once the course material has been accessed or downloaded, we do
              not offer refunds, cancellations, or exchanges under any
              circumstances.
            </p>
          </section>

          {/* Exceptions */}
          <section>
            <h2 className="text-sm font-bold text-white">Exceptions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Refunds may only be considered in the following rare cases:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>Duplicate payment made for the same course</li>
              <li>Payment completed but course access not provided</li>
            </ul>
          </section>

          {/* User Responsibility */}
          <section>
            <h2 className="text-sm font-bold text-white">
              User Responsibility
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Users are advised to carefully review course details, curriculum,
              and requirements before making a purchase. By completing a
              purchase, you agree to this policy.
            </p>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Support & Assistance
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              If you face any issues accessing your course materials, please
              contact our support team. We will ensure that you receive proper
              access to your purchased content.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              For any queries, reach us at{" "}
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
