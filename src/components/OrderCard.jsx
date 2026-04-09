// OrderCard.jsx (dark electronics theme)
import toast from "react-hot-toast";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatMoney(n) {
  const num = Number(n || 0);
  return `₹${num.toFixed(0)}`;
}

function statusStyles(status = "") {
  const s = String(status).toLowerCase();

  if (s.includes("delivered"))
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
  if (s.includes("shipped") || s.includes("out"))
    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";
  if (s.includes("cancel"))
    return "border-red-500/20 bg-red-500/10 text-red-200";
  if (s.includes("pending") || s.includes("processing"))
    return "border-amber-500/20 bg-amber-500/10 text-amber-200";

  return "border-white/10 bg-white/5 text-slate-200";
}

export default function OrderCard({ order }) {
  const orderNo = order?.id ? String(order.id).slice(0, 8).toUpperCase() : "—";
  const dateStr = order?.created_at
    ? new Date(order.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const items = Array.isArray(order?.items) ? order.items : [];
  const total =
    typeof order?.total !== "undefined"
      ? Number(order.total)
      : items.reduce(
          (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
          0,
        );

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/10">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/10 bg-black/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold tracking-wide text-slate-400">
            ORDER #{orderNo}
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{dateStr}</p>
        </div>

        <span
          className={cx(
            "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur",
            statusStyles(order?.status),
          )}
        >
          {order?.status || "Unknown"}
        </span>
      </div>

      {/* Items */}
      <div className="px-5 py-4">
        <div className="space-y-3">
          {items.map((item, i) => {
            const qty = Number(item?.quantity || 0);
            const lineTotal = Number(item?.price || 0) * qty;

            return (
              <div
                key={item?.id || item?.sku || `${item?.title}-${i}`}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {item?.title || "Item"}
                  </p>

                  {item?.variantLabel ? (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.variantLabel}
                    </p>
                  ) : null}

                  <div className="mt-2 inline-flex flex-wrap items-center gap-2 text-xs text-slate-200">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 backdrop-blur">
                      Qty: {qty}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">
                      {formatMoney(item?.price)} each
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-extrabold text-white">
                    {formatMoney(lineTotal)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">Line total</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Items</span>
            <span className="font-semibold text-white">{items.length}</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Total</span>
            <span className="text-lg font-extrabold text-white">
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Need help? Contact support with Order #{orderNo}.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(String(order?.id || ""));
              toast.success("Order ID copied to clipboard");
            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 backdrop-blur"
          >
            Copy Order ID
          </button>
        </div>
      </div>
    </div>
  );
}
