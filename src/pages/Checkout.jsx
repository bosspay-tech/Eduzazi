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
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-12 text-gray-900">
        <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
            🧺
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Add items to your cart to proceed to checkout.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-2xl bg-[#a435f0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8710d8] focus:outline-none focus:ring-4 focus:ring-[#a435f0]/20"
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
    <div className="min-h-[70vh] bg-[#f7f9fa] text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Checkout
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Review your items and place your order.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
              <span className="text-gray-500">Items:</span>{" "}
              <span className="font-semibold text-gray-900">{totalItems}</span>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
              <span className="text-gray-500">Total:</span>{" "}
              <span className="font-semibold text-gray-900">
                {formatMoney(subtotal)}
              </span>
            </div>
          </div>
        </div>

        {!user ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            You’re placing this order as a{" "}
            <span className="font-semibold">guest</span>.
            <span className="ml-2 text-amber-600">
              (Optional) Login to track orders more easily.
            </span>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Order Summary
                </h3>
                <p className="mt-1 text-xs text-gray-600">
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
                        className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {item.title}
                          </p>

                          {item.variantLabel ? (
                            <p className="mt-0.5 text-xs text-gray-500">
                              {item.variantLabel}
                            </p>
                          ) : null}

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                              Qty: {qty}
                            </span>
                            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                              Each: {formatMoney(item.price)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-gray-900">
                            {formatMoney(line)}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            Line total
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatMoney(subtotal)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-gray-400">Calculated later</span>
                  </div>

                  <div className="my-3 h-px bg-gray-200" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-extrabold text-gray-900">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    to="/cart"
                    className="text-sm font-semibold text-[#5624d0] hover:text-[#401b9c] hover:underline"
                  >
                    ← Edit cart
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">
                Place your order
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                By placing the order you agree to our policies.
              </p>

              <button
                onClick={placeOrder}
                disabled={loading}
                className={[
                  "mt-5 w-full rounded-2xl py-3 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-4",
                  loading
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-[#a435f0] text-white hover:bg-[#8710d8] focus:ring-[#a435f0]/20",
                ].join(" ")}
              >
                {loading
                  ? "Placing order..."
                  : `Place Order • ${formatMoney(subtotal)}`}
              </button>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-700">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  🔒 Secure payments
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  ⚡ Fast delivery
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  📘 Digital access
                </span>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Tip: Login enables order tracking in “My Orders”.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
