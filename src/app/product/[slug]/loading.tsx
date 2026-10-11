import React from "react";

export default function ProductLoading() {
  return (
    <div className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-6 py-8 w-full animate-pulse space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-[#f0f5f0] rounded w-48" />

      {/* Top Summary Card Skeleton */}
      <div className="bg-white border border-[#e1e8e1] rounded-2xl p-6 sm:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f0f5f0] rounded-2xl" />
          <div className="space-y-2.5">
            <div className="h-6 bg-[#f0f5f0] rounded w-44" />
            <div className="h-4 bg-[#f0f5f0] rounded w-28" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-[#f0f5f0] rounded w-32" />
        </div>
      </div>

      {/* 3 Price Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white border border-[#e1e8e1] rounded-2xl p-6 h-28 space-y-2">
            <div className="h-3 bg-[#f0f5f0] rounded w-20" />
            <div className="h-6 bg-[#f0f5f0] rounded w-28" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-[#e1e8e1] rounded-2xl h-64" />
    </div>
  );
}
