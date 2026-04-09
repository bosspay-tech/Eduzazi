// ReturnsRefunds.jsx (updated)
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
            <span className="font-semibold text-white">Returns & Refunds</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Returns & Refund Policy
          </h1>
        </div>

        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          {/* Return Window */}
          <section>
            <h2 className="text-sm font-bold text-white">Return Window</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Returns are accepted within{" "}
              <span className="font-semibold text-slate-100">7 days</span> of
              delivery. Requests raised after this window may not be accepted.
            </p>
          </section>

          {/* Eligibility & Conditions */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Eligibility & Conditions
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Returns are only accepted if you received an incorrect item or
                an item not listed on your bill due to our error.
              </li>
              <li>
                We recommend recording a short video while opening your parcel.
                This helps in case of defective or incorrect items.
              </li>
              <li>
                For branded items, returns are accepted only if original
                packaging and all contents are intact.
              </li>
              <li>
                A return authorization is mandatory before sending any product
                back.
              </li>
              <li>
                Products sent without authorization will be returned to the
                sender.
              </li>
            </ul>
          </section>

          {/* Non Returnable */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Non-Returnable Items
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Personalized or customized products.</li>
              <li>Products damaged due to misuse or mishandling.</li>
            </ul>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-sm font-bold text-white">Return Process</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Once approved, we will provide a return shipping label.</li>
              <li>
                You must securely pack the product with all original contents.
              </li>
              <li>We recommend using original packaging if available.</li>
              <li>
                Record a video while packing your return for verification.
              </li>
              <li>Our team will also record an unboxing video upon receipt.</li>
            </ul>
          </section>

          {/* How to Initiate */}
          <section>
            <h2 className="text-sm font-bold text-white">
              How to Initiate a Return
            </h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Contact support at{" "}
                <span className="font-semibold text-cyan-300">
                  support@educazi.com
                </span>{" "}
                with your order ID.
              </li>
              <li>
                Share images/video if the product is damaged or incorrect.
              </li>
              <li>
                We will arrange pickup (if serviceable) or provide return
                instructions.
              </li>
            </ol>
          </section>

          {/* Exchange */}
          <section>
            <h2 className="text-sm font-bold text-white">Exchange</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Exchanges are available for the same product (subject to
              availability). If unavailable, a refund or store credit will be
              provided.
            </p>
          </section>

          {/* Refunds */}
          <section>
            <h2 className="text-sm font-bold text-white">Refunds</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Refunds are processed within{" "}
              <span className="font-semibold text-slate-100">
                5–10 business days
              </span>{" "}
              after the item passes quality check. Shipping and packaging
              charges are non-refundable. COD refunds are processed via bank
              transfer/UPI after verification.
            </p>
          </section>

          {/* Damaged */}
          <section>
            <h2 className="text-sm font-bold text-white">
              Damaged / Wrong Item
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              If you receive a damaged or incorrect item, contact us within{" "}
              <span className="font-semibold text-slate-100">48 hours</span>{" "}
              with images or unboxing video. We will resolve it via replacement
              or refund.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              For any questions, reach us at{" "}
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
