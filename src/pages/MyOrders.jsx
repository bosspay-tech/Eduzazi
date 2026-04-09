// MyOrders.jsx (dark electronics theme)
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../features/auth/useAuth";
import { STORE_ID } from "../config/store";
import OrderCard from "../components/OrderCard";

function SkeletonOrder() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="border-b border-white/10 bg-black/20 px-5 py-4">
        <div className="h-3 w-28 rounded bg-white/10" />
        <div className="mt-3 h-4 w-40 rounded bg-white/10" />
      </div>
      <div className="px-5 py-4">
        <div className="h-16 rounded-2xl bg-white/10" />
        <div className="mt-3 h-16 rounded-2xl bg-white/10" />
        <div className="mt-5 h-16 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let alive = true;

    const fetchOrders = async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .eq("store_id", STORE_ID)
        .order("created_at", { ascending: false });

      if (!alive) return;

      if (error) {
        setErr(error.message || "Failed to load orders.");
        setOrders([]);
      } else {
        setOrders(data || []);
      }

      setLoading(false);
    };

    fetchOrders();
    return () => {
      alive = false;
    };
  }, [user, authLoading]);

  const stats = useMemo(() => {
    const count = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { count, totalSpent };
  }, [orders]);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="h-7 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-6 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonOrder key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-10 text-slate-100">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-sm backdrop-blur">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            🔐
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Sign in to view orders
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Your past orders and invoices will show up here once you’re signed
            in.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/login"
              className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
            >
              Login
            </Link>
            <Link
              to="/products"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10 backdrop-blur"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              My Orders
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Track your purchases and view order details.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
              <span className="text-slate-400">Orders:</span>{" "}
              <span className="font-semibold text-white">{stats.count}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
              <span className="text-slate-400">Total spent:</span>{" "}
              <span className="font-semibold text-white">
                ₹{stats.totalSpent.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {err ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        {/* Loading */}
        {loading ? (
          <div className="mt-8 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonOrder key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-sm backdrop-blur">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              🧾
            </div>
            <h3 className="text-lg font-semibold text-white">
              You have no orders yet
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Once you place an order, it will appear here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
