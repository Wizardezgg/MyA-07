import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getBengaliDate } from "@/lib/bengali";

export default function Hero() {
  const banglaDate = getBengaliDate();

  return (
    <section className="w-full py-8 sm:py-12 bg-gradient-to-b from-[#fafcfa] to-[#f0f5f0] border-b border-[#e1e8e1]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="md:col-span-7 flex flex-col items-start">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf8ef] border border-[#c3d4c5] text-xs font-semibold text-[#05893e] mb-4">
              <span>📅</span>
              <span>{banglaDate}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1d271f] tracking-tight leading-tight mb-4">
              আজকের বাজারের দাম <br className="hidden sm:inline" />
              <span className="text-[#05893e]">এক নজরে</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#657568] max-w-xl mb-6 leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার নির্ভরযোগ্য দৈনিক বাজারদর প্রতিদিন যাচাই করুন।
            </p>

            {/* CTA Button scrolls down to #সব-পণ্য on the same page */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#সব-পণ্য"
                className="px-6 py-3 rounded-xl bg-[#05893e] hover:bg-[#047f39] text-[#f3fbf4] font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>সব পণ্য দেখুন</span>
                <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Illustration */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[340px] aspect-[4/3] drop-shadow-sm">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর ইলাস্ট্রেশন"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
