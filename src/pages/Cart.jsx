// Cart.jsx (dark electronics theme)
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cart.store";

function formatMoney(n) {
  const num = Number(n || 0);
  return `₹${num.toFixed(0)}`;
}

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCartStore();

  // Empty state
  if (!items?.length) {
    return (
      <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-12 text-slate-100">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-sm backdrop-blur">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            🛒
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Looks like you haven’t added anything yet.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce(
    (sum, it) => sum + Number(it.quantity || 0),
    0,
  );

  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Your Cart
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Review items and proceed to checkout.
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
                {formatMoney(total())}
              </span>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => {
              const lineTotal =
                Number(item.price || 0) * Number(item.quantity || 0);

              return (
                <div
                  key={`${item.productId || item.title}-${item.variantSku || ""}-${i}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left */}
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400">
                        🧩
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.title}
                        </p>

                        {item.variantLabel ? (
                          <p className="mt-1 text-xs text-slate-400">
                            {item.variantLabel}
                          </p>
                        ) : null}

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                            Price: {formatMoney(item.price)}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                            Line: {formatMoney(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              i,
                              Math.max(1, Number(item.quantity || 1) - 1),
                            )
                          }
                          className="px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 rounded-l-2xl"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQty(
                              i,
                              Math.max(1, Number(e.target.value || 1)),
                            )
                          }
                          className="w-16 border-x border-white/10 bg-transparent px-2 py-2 text-center text-sm text-slate-100 outline-none"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            updateQty(i, Number(item.quantity || 1) + 1)
                          }
                          className="px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 rounded-r-2xl"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/15 focus:outline-none focus:ring-4 focus:ring-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/products"
                className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-white">
                Order Summary
              </h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Items</span>
                  <span className="font-semibold text-white">{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    {formatMoney(total())}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className="text-slate-500">Calculated at checkout</span>
                </div>

                <div className="my-3 h-px bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Total
                  </span>
                  <span className="text-lg font-extrabold text-white">
                    {formatMoney(total())}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-5 block w-full rounded-2xl bg-cyan-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                Checkout
              </Link>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
