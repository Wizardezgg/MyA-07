"use client";

import React, { useState, useTransition } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { toBnNum } from "@/lib/bengali";

interface CategoryProductListProps {
  initialProducts: Product[];
}

type SortOption = "default" | "price-asc" | "price-desc";

export default function CategoryProductList({ initialProducts }: CategoryProductListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [isPending, startTransition] = useTransition();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SortOption;
    startTransition(() => {
      setSortOption(val);
    });
  };

  // Challenge C1: Sort numerically by product.today (handling Bengali & numeric data)
  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.today - b.today;
    }
    if (sortOption === "price-desc") {
      return b.today - a.today;
    }
    return 0; // Default order
  });

  return (
    <div className="space-y-6">
      {/* White Bar: Contains only right-aligned 'সাজান' dropdown */}
      <div className="bg-white px-5 py-3 rounded-2xl border border-[#e2e8e2] shadow-xs flex items-center justify-end">
        {/* Challenge C1: Sort dropdown with chevron icon */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs sm:text-sm font-semibold text-[#657568] whitespace-nowrap">
            সাজান:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              className="appearance-none bg-white border border-[#e2e8e2] hover:border-[#088743] rounded-xl pl-3 pr-8 py-1.5 text-xs sm:text-sm font-medium text-[#1d271f] focus:outline-none focus:border-[#088743] cursor-pointer shadow-xs transition-all"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#657568]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Product count text placed directly on the page background below the white card */}
      <div className="text-xs sm:text-sm text-[#657568] -mt-2">
        মোট {toBnNum(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
      </div>


      {/* Grid of Product Cards or Transition Skeleton */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white border border-[#e1e8e1] rounded-2xl p-5 h-36 animate-pulse"
            >
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 bg-[#f0f5f0] rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#f0f5f0] rounded w-3/4" />
                  <div className="h-3 bg-[#f0f5f0] rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-[#f0f5f0] rounded w-1/3 mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
