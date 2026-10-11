import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#e1e8e1] py-4 sm:py-5 text-xs text-[#657568]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-[#4b5563]">
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p className="text-[#657568]">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </div>
    </footer>
  );
}
