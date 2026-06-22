'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, GraduationCap, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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
}

export default function ProductCard({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const finalPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-violet-600/5 hover:border-violet-200 transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
      {/* Dynamic Link wrapper */}
      <Link href={`/services/${product._id}`} className="flex flex-col flex-1 min-h-0">
        
        {/* Service Cover Image Banner */}
        <div className="relative w-full aspect-[16/10] bg-slate-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-555"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Service Card Details */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            {/* Category and Rating */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold bg-violet-50 text-violet-600 tracking-wide uppercase border border-violet-100/50">
                <GraduationCap className="h-3.5 w-3.5" />
                {product.category || 'Counseling Service'}
              </span>
              
              {/* Rating stars */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-lg">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-amber-800">{parseFloat(String(product.rating || '4.9')).toFixed(1)}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-extrabold text-gray-900 group-hover:text-violet-650 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {/* Pricing Details */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration Fee</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-gray-900">
                  ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div
              className="p-3 bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white rounded-xl transition-all duration-300 shadow-sm flex-shrink-0 border border-violet-100 group-hover:border-violet-600 hover:scale-105 active:scale-95 flex items-center gap-1 text-xs font-bold"
            >
              <span>Details</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
