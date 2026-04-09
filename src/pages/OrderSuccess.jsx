// OrderSuccess.jsx (dark electronics theme)
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-12 text-slate-100">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm text-center backdrop-blur">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-2xl">✅</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Order placed successfully
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-slate-300">
            Thank you for shopping with us. We’re getting your order ready and
            will update you soon.
          </p>

          {/* Divider */}
          <div className="my-6 h-px w-full bg-white/10" />

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
            >
              Continue shopping
            </Link>

            <Link
              to="/orders"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10 backdrop-blur"
            >
              View my orders
            </Link>
          </div>

          {/* Tiny trust row */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-200">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              📦 Packed soon
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              ⚡ Fast dispatch
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              🔒 Secure payments
            </span>
          </div>
        </div>

        {/* Optional footer text */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Need help? Visit{" "}
          <Link
            to="/help"
            className="font-semibold text-cyan-300 hover:underline"
          >
            Help Center
          </Link>
        </p>
      </div>
    </div>
  );
}
