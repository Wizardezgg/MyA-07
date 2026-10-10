import React from "react";

export default function CategoryLoading() {
  return (
    <div className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-6 py-8 w-full animate-pulse space-y-8">
      {/* Category Header Skeleton */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-[#e1e8e1]">
        <div className="w-16 h-16 rounded-2xl bg-[#f0f5f0]" />
        <div className="space-y-2.5 flex-1">
          <div className="h-6 bg-[#f0f5f0] rounded w-48" />
          <div className="h-4 bg-[#f0f5f0] rounded w-32" />
        </div>
      </div>

      {/* Sort Bar Skeleton */}
      <div className="h-16 bg-white border border-[#e1e8e1] rounded-2xl" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white border border-[#e1e8e1] rounded-2xl p-5 h-36"
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
    </div>
  );
}
