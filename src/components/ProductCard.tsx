import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { toBnNum, formatBnUnit } from "@/lib/bengali";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  // In Bazar Dor Figma design:
  // Price Rise (দাম বেড়েছে) = Red alert badge (▲)
  // Price Fall (দাম কমেছে) = Green savings badge (▼)
  const badgeTextColor = isUp
    ? "text-[#d03739]"
    : isDown
    ? "text-[#088743]"
    : "text-[#657568]";

  const badgeBgColor = isUp
    ? "bg-[#fdeeed]"
    : isDown
    ? "bg-[#eaf8ef]"
    : "bg-[#f0f5f0]";

  const arrow = isUp ? "▲" : isDown ? "▼" : "—";
  const changeVal =
    product.change?.pct !== undefined
      ? `${arrow} ${toBnNum(product.change.pct)}%`
      : "— ০.০%";

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group block bg-white border border-[#e5e7eb]/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#088743]/50 transition-all duration-200"
    >
      {/* Top Row: Soft-bg Icon Container + Title & Unit */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#f4f7f4] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
          {product.image || product.categoryIcon || "🛒"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-[#1d271f] truncate group-hover:text-[#088743] transition-colors">
            {product.nameBn}
          </h3>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {formatBnUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* Bottom Row: Price & Badge (clean spacing, no divider line) */}
      <div className="flex items-end justify-between mt-4">
        <div>
          <span className="block text-[11px] text-[#6b7280]">আজকের দাম</span>
          <span className="text-base sm:text-lg font-bold text-[#1d271f]">
            {toBnNum(product.today)} টাকা
          </span>
        </div>
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${badgeBgColor} ${badgeTextColor}`}
        >
          {changeVal}
        </div>
      </div>
    </Link>
  );
}
