import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { STORE_ID } from "../config/store";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { courses } from "../data";

const ITEMS_PER_PAGE = 12;

/* ---------- SKELETON ---------- */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="mt-3 h-3 w-full rounded bg-gray-200" />
        <div className="mt-2 h-3 w-5/6 rounded bg-gray-200" />
        <div className="mt-4 h-5 w-24 rounded bg-gray-200" />
        <div className="mt-4 h-9 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function Products() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const type = params.get("type");

  const products = courses;
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [q, category, type]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      `${p.title ?? ""} ${p.description ?? ""} ${p.short_description ?? ""}`
        .toLowerCase()
        .includes(s),
    );
  }, [products, q]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (newPage) => {
    const next = Math.max(1, Math.min(newPage, totalPages || 1));
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[70vh] bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Courses
            </h2>

            {/* Active filters chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {category ? (
                <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Category: <span className="text-purple-700">{category}</span>
                </span>
              ) : null}
              {type ? (
                <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Type: <span className="text-purple-700">{type}</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* ERROR */}
        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {/* CONTENT */}
        <div className="mt-8">
          {loading ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">Loading products…</p>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-200">
                🧩
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {q.trim()
                  ? "Try a different search term."
                  : "New stock is coming soon."}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {q.trim() && (
                  <button
                    onClick={() => setQ("")}
                    className="rounded-xl bg-[#a435f0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8710d8] focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                  >
                    Clear search
                  </button>
                )}

                {(category || type) && (
                  <Link
                    to="/products"
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* GRID */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.title}`}
                    className="block rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10"
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- PAGINATION HELPERS ---------- */
function getPageItems(totalPages, currentPage) {
  const siblingCount = 1;
  const showEdges = true;

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [];
  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSibling > 2;
  const shouldShowRightDots = rightSibling < totalPages - 1;

  if (showEdges) items.push(1);

  if (shouldShowLeftDots) items.push("...");
  else {
    for (let p = 2; p < leftSibling; p++) items.push(p);
  }

  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== 1 && p !== totalPages) items.push(p);
  }

  if (shouldShowRightDots) items.push("...");
  else {
    for (let p = rightSibling + 1; p < totalPages; p++) items.push(p);
  }

  if (showEdges) items.push(totalPages);

  return items.filter((v, i, a) => i === a.indexOf(v));
}

/* ---------- PAGINATION UI ---------- */
function Pagination({ totalPages, currentPage, onChange }) {
  const items = useMemo(
    () => getPageItems(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="mt-12">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">        
        {/* Controls */}
        <nav
          aria-label="Pagination"
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
        >
          {/* Prev */}
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onChange(currentPage - 1)}
            className="group inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="h-6 w-px bg-gray-200" />

          {/* Page pills */}
          <div className="flex items-center gap-1">
            {items.map((it, idx) =>
              it === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-sm font-semibold text-gray-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={it}
                  type="button"
                  onClick={() => onChange(it)}
                  aria-current={currentPage === it ? "page" : undefined}
                  className={[
                    "h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition",
                    currentPage === it
                      ? "bg-[#a435f0] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {it}
                </button>
              ),
            )}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Next */}
          <button
            type="button"
            disabled={!canNext}
            onClick={() => onChange(currentPage + 1)}
            className="group inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="text-base leading-none">→</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
