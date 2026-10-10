import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fafcfa] border-t border-[#e1e8e1] py-8 text-sm">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Left Side */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#05893e] flex items-center justify-center p-1.5 shadow-sm flex-shrink-0">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Image
                  src="/logo-icon.png"
                  alt="বাজার দর"
                  width={16}
                  height={16}
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
            <p className="font-semibold text-[#1d271f]">
              বাজার দর — <span className="text-[#657568] font-normal">প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
            </p>
          </div>

          {/* Right Side */}
          <div>
            <p className="text-xs text-[#657568] max-w-md">
              সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
