'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import ProductCard from '@/components/product-card';
import { apiUrl } from '@/lib/api';
import { ChevronLeft, ChevronRight, Filter, X, Search, Sparkles, HelpCircle } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  color: string[];
  size: string[];
  category?: string;
  rating?: number;
  description?: string;
}

const SERVICES_PER_PAGE = 6;

export default function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const servicesRef = useRef<HTMLDivElement>(null);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(apiUrl('/api/categories'));
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    params.set('page', currentPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [selectedCategory, currentPage, router]);

  // Fetch products (counseling services) from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query =
          selectedCategory !== 'All'
            ? `?category=${encodeURIComponent(selectedCategory)}&limit=1000`
            : '?limit=1000';
        const res = await fetch(apiUrl(`/api/products${query}`));
        const data = await res.json();
        setProducts(data.products ?? []);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  // Pagination calculations
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / SERVICES_PER_PAGE));
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const endIndex = startIndex + SERVICES_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const displayStart = totalProducts > 0 ? startIndex + 1 : 0;
  const displayEnd = Math.min(endIndex, totalProducts);

  const allCategories = ['All', ...categories];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-900 to-slate-950 py-20 text-white border-b border-slate-900">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0V0zm20%2020h20v20H20V20z%22%20fill%3D%22%237C3AED%22%20fill-opacity%3D%220.15%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-violet-300 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
              One-on-One Admissions Consultation
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white">
            Counseling Services
          </h1>
          <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Explore our expert consultation programs. Provide your profile credentials, pay the registration fee, and get matched to high-caliber university guides.
          </p>

          {/* Centered Search Bar */}
          <div className="max-w-xl mx-auto relative mt-6 shadow-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by counseling module or country keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-11 py-3.5 bg-white text-gray-900 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-600/20 focus:border-violet-600 transition text-sm font-semibold placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Services Catalog Feed */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1" ref={servicesRef}>
        
        {/* Horizontal Category Filters */}
        <div className="border-b border-slate-100 pb-8 mb-8">
          <div className="flex flex-wrap gap-2.5 items-center justify-center">
            {categoriesLoading ? (
              <div className="flex gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-28 bg-slate-50 rounded-full animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : (
              allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-violet-600 text-white shadow-md border-violet-600'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-violet-600 border-slate-200'
                  }`}
                >
                  {category === 'All' ? 'All Services' : category}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Catalog Subheader */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-100 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Catalog Feed</span>
            <p className="text-sm font-bold text-slate-700">
              Showing {displayStart}–{displayEnd} of {totalProducts} {totalProducts === 1 ? 'service' : 'services'}
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
            <HelpCircle className="h-4 w-4 text-violet-650" />
            <span>Interactive Profiling Forms</span>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl h-80 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-650 transition hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`min-w-[2.5rem] h-10 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                          currentPage === item
                            ? 'border-violet-600 bg-violet-600 text-white shadow-md'
                            : 'border-slate-200 bg-white text-slate-650 hover:border-slate-350'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-650 transition hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mb-4 border border-violet-100/30">
              <Filter className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No services match your search criteria</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Try resetting filters or changing key search query parameters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-6 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold transition hover:bg-violet-750 shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>
    </div>
  );
}
