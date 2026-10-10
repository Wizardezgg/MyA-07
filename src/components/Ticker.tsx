import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { toBnNum, formatBnUnit } from "@/lib/bengali";

interface TickerProps {
  products: Product[];
}

export default function Ticker({ products }: TickerProps) {
  // Use first 10 products for the ticker loop
  const tickerItems = products.slice(0, 10);
  // Duplicate for seamless infinite loop animation
  const loopList = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-[#f0f5f0] border-b border-[#e1e8e1] overflow-hidden py-2 select-none">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {loopList.map((item, idx) => {
          const isUp = item.change?.dir === "up";
          const isDown = item.change?.dir === "down";
          const badgeColor = isUp
            ? "text-[#1a9951]"
            : isDown
            ? "text-[#d03739]"
            : "text-[#657568]";
          const arrow = isUp ? "▲" : isDown ? "▼" : "—";
          const changePct = item.change?.pct ? `${arrow} ${toBnNum(item.change.pct)}%` : "— ০.০%";

          return (
            <Link
              key={`${item.id}-${idx}`}
              href={`/product/${item.slug || item.id}`}
              className="inline-flex items-center gap-2 px-5 text-xs sm:text-sm font-medium text-[#1d271f] hover:text-[#05893e] transition-colors"
            >
              <span>{item.image || item.categoryIcon || "🛒"}</span>
              <span className="font-semibold">{item.nameBn}</span>
              <span className="text-[#657568]">
                {toBnNum(item.today)} টাকা/{formatBnUnit(item.unit).replace("প্রতি ", "")}
              </span>
              <span className={`font-semibold ${badgeColor}`}>{changePct}</span>
              <span className="text-[#c3d4c5] ml-3">•</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
