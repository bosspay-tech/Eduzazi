// ShippingPolicy.jsx (dark electronics theme)
import React from "react";
import { Link } from "react-router-dom";

export default function ShippingPolicy() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <div className="text-sm text-slate-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>{" "}
            <span className="text-slate-600">/</span>{" "}
            <span className="font-semibold text-white">Shipping Policy</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Shipping Policy
          </h1>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <section>
            <h2 className="text-sm font-bold text-white">Shipping Locations</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We currently ship across India. If your location is not
              serviceable, you will be informed at checkout or during order
              confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Order Processing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Orders are usually processed within{" "}
              <span className="font-semibold text-slate-100">24–48 hours</span>{" "}
              (excluding Sundays and public holidays). During high-volume sale
              periods, processing may take longer.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Delivery Timelines</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Metro cities: 2–5 business days</li>
              <li>Other cities/towns: 3–7 business days</li>
              <li>Remote locations: 5–10 business days</li>
            </ul>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Timelines are estimates and may vary due to courier delays,
              weather, strikes, or unforeseen events.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Shipping Charges</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Free shipping on orders above{" "}
                <span className="font-semibold text-slate-100">₹999</span>{" "}
                (example)
              </li>
              <li>
                Flat shipping fee of{" "}
                <span className="font-semibold text-slate-100">₹79</span> below
                the threshold (example)
              </li>
            </ul>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Exact charges (if applicable) will be shown at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              Tracking Your Order
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Once shipped, you will receive tracking details via SMS/email. You
              can also view order status in your account (if available).
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Delivery Attempts</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Couriers typically attempt delivery 2–3 times. If delivery fails,
              the shipment may be returned to us. Re-shipping may incur
              additional charges.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Questions about shipping? Email us at{" "}
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
