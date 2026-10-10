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

  // Penpot style: badges use base-200 fill with colored text or specific accent backgrounds
  const badgeTextColor = isUp
    ? "text-[#1a9951]"
    : isDown
    ? "text-[#d03739]"
    : "text-[#657568]";
  
  const badgeBgColor = isUp
    ? "bg-[#eaf8ef]"
    : isDown
    ? "bg-[#fdeeed]"
    : "bg-[#f0f5f0]";

  const arrow = isUp ? "▲" : isDown ? "▼" : "—";
  const changeVal = product.change?.pct !== undefined
    ? `${arrow} ${toBnNum(product.change.pct)}%`
    : "— ০.০%";

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group block bg-[#fafcfa] border border-[#e1e8e1] rounded-2xl p-4.5 hover:border-[#05893e] hover:shadow-md transition-all duration-200"
    >
      {/* Top Row: Emoji Icon + Title & Unit */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-[#e1e8e1] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
          {product.image || product.categoryIcon || "🛒"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[#1d271f] truncate group-hover:text-[#05893e] transition-colors">
            {product.nameBn}
          </h3>
          <p className="text-xs text-[#657568] mt-0.5">
            {formatBnUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* Bottom Row: Price & Change Badge */}
      <div className="flex items-end justify-between pt-2 border-t border-[#f0f5f0]">
        <div>
          <span className="block text-xs text-[#657568]">আজকের দাম</span>
          <span className="text-lg font-bold text-[#1d271f]">
            {toBnNum(product.today)} টাকা
          </span>
        </div>
        <div
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${badgeBgColor} ${badgeTextColor}`}
        >
          {changeVal}
        </div>
      </div>
    </Link>
  );
}
