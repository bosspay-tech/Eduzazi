import { Link } from "react-router-dom";
import { useCartStore } from "../store/cart.store";

function formatMoney(n) {
  const num = Number(n || 0);
  return `₹${num.toFixed(0)}`;
}

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCartStore();

  if (!items?.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-12 text-gray-900">
        <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
            🛒
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Looks like you haven’t added anything yet.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-2xl bg-[#a435f0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8710d8] focus:outline-none focus:ring-4 focus:ring-[#a435f0]/20"
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
    <div className="min-h-[70vh] bg-[#f7f9fa] text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Your Cart
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Review items and proceed to checkout.
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
                {formatMoney(total())}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, i) => {
              const lineTotal =
                Number(item.price || 0) * Number(item.quantity || 0);

              return (
                <div
                  key={`${item.productId || item.title}-${item.variantSku || ""}-${i}`}
                  className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 text-gray-400">
                        🧩
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>

                        {item.variantLabel ? (
                          <p className="mt-1 text-xs text-gray-500">
                            {item.variantLabel}
                          </p>
                        ) : null}

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                            Price: {formatMoney(item.price)}
                          </span>
                          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                            Line: {formatMoney(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center rounded-2xl border border-gray-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              i,
                              Math.max(1, Number(item.quantity || 1) - 1),
                            )
                          }
                          className="rounded-l-2xl px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
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
                          className="w-16 border-x border-gray-200 bg-white px-2 py-2 text-center text-sm text-gray-900 outline-none"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            updateQty(i, Number(item.quantity || 1) + 1)
                          }
                          className="rounded-r-2xl px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
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
                className="text-sm font-semibold text-[#5624d0] hover:text-[#401b9c] hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">
                Order Summary
              </h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Items</span>
                  <span className="font-semibold text-gray-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(total())}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-gray-400">Calculated at checkout</span>
                </div>

                <div className="my-3 h-px bg-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-extrabold text-gray-900">
                    {formatMoney(total())}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-5 block w-full rounded-2xl bg-[#a435f0] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#8710d8] focus:outline-none focus:ring-4 focus:ring-[#a435f0]/20"
              >
                Checkout
              </Link>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
