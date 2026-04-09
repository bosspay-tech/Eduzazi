function ProductCard({ product, onViewDetails }) {
  const price = Number(product?.price ?? 0);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-50">
        <img
          src={product?.imageUrl}
          alt={product?.title}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* subtle overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/5 via-transparent to-transparent" />

        {/* Quick Action */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => onViewDetails?.(product)}
            className="translate-y-4 rounded-full bg-[#a435f0] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:translate-y-0 hover:bg-[#8710d8]"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#5624d0]">
          {product?.title}
        </h3>
        <div className="mt-auto flex items-end justify-between border-t border-gray-200 pt-4">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-gray-900">
              ₹{price.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onViewDetails?.(product)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 transition-all hover:border-[#a435f0] hover:bg-[#a435f0] hover:text-white"
            aria-label="View Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
