import React from "react";

export default function ProfileLoading() {
  return (
    <div className="flex-1 max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full animate-pulse space-y-6">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-[#f0f5f0] rounded w-36" />

      {/* User Summary Card Skeleton */}
      <div className="bg-white border border-[#e1e8e1] rounded-2xl p-6 sm:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f0f5f0] rounded-2xl" />
          <div className="space-y-2">
            <div className="h-6 bg-[#f0f5f0] rounded w-40" />
            <div className="h-4 bg-[#f0f5f0] rounded w-52" />
          </div>
        </div>
        <div className="h-9 bg-[#f0f5f0] rounded-xl w-24" />
      </div>

      {/* Form Card Skeleton */}
      <div className="bg-white border border-[#e1e8e1] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="h-6 bg-[#f0f5f0] rounded w-48" />
        <div className="h-4 bg-[#f0f5f0] rounded w-72" />
        <div className="h-10 bg-[#f0f5f0] rounded-xl w-full max-w-lg mt-4" />
        <div className="h-10 bg-[#f0f5f0] rounded-xl w-full max-w-lg" />
        <div className="h-10 bg-[#f0f5f0] rounded-xl w-36" />
      </div>
    </div>
  );
}
