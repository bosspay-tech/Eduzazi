// Checkout.jsx (dark electronics theme)
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cart.store";
import { STORE_ID } from "../config/store";
import { useAuth } from "../features/auth/useAuth";

function formatMoney(n) {
  const num = Number(n || 0);
  return `₹${num.toFixed(0)}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useMemo(() => Number(total()), [total]);
  const totalItems = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.quantity || 0), 0),
    [items],
  );

  if (!items?.length) {
    return (
      <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-12 text-slate-100">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-sm backdrop-blur">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            🧺
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Add items to your cart to proceed to checkout.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.from("orders").insert({
      store_id: STORE_ID,
      user_id: user?.id || null,
      items,
      total: subtotal,
      status: "placed",
    });

    if (error) {
      setError(error.message || "Failed to place order.");
      setLoading(false);
      return;
    }

    clearCart();
    navigate("/order-success");
  };

  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Checkout
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Review your items and place your order.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
              <span className="text-slate-400">Items:</span>{" "}
              <span className="font-semibold text-white">{totalItems}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
              <span className="text-slate-400">Total:</span>{" "}
              <span className="font-semibold text-white">
                {formatMoney(subtotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Guest note */}
        {!user ? (
          <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            You’re placing this order as a{" "}
            <span className="font-semibold">guest</span>.
            <span className="ml-2 text-amber-200/80">
              (Optional) Login to track orders more easily.
            </span>
          </div>
        ) : null}

        {/* Error */}
        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {/* Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Order summary list */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur">
              <div className="border-b border-white/10 bg-black/20 px-5 py-4">
                <h3 className="text-sm font-semibold text-white">
                  Order Summary
                </h3>
                <p className="mt-1 text-xs text-slate-300">
                  Confirm quantities and variant selections.
                </p>
              </div>

              <div className="px-5 py-4">
                <div className="space-y-3">
                  {items.map((item, i) => {
                    const qty = Number(item.quantity || 0);
                    const line = Number(item.price || 0) * qty;

                    return (
                      <div
                        key={`${item.productId || item.title}-${item.variantSku || ""}-${i}`}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {item.title}
                          </p>
                          {item.variantLabel ? (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {item.variantLabel}
                            </p>
                          ) : null}

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-200">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                              Qty: {qty}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                              Each: {formatMoney(item.price)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-white">
                            {formatMoney(line)}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            Line total
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Shipping</span>
                    <span className="text-slate-500">Calculated later</span>
                  </div>

                  <div className="my-3 h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      Total
                    </span>
                    <span className="text-lg font-extrabold text-white">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    to="/cart"
                    className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:underline"
                  >
                    ← Edit cart
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky action card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-white">
                Place your order
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                By placing the order you agree to our policies.
              </p>

              <button
                onClick={placeOrder}
                disabled={loading}
                className={[
                  "mt-5 w-full rounded-2xl py-3 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-4",
                  loading
                    ? "cursor-not-allowed bg-white/10 text-slate-500"
                    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 focus:ring-cyan-500/20",
                ].join(" ")}
              >
                {loading
                  ? "Placing order..."
                  : `Place Order • ${formatMoney(subtotal)}`}
              </button>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                  🔒 Secure payments
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                  ⚡ Fast dispatch
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                  🧯 ESD-safe packing
                </span>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Tip: Login enables order tracking in “My Orders”.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
