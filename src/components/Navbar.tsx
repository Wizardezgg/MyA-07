"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Category } from "@/types";
import { getBengaliDate } from "@/lib/bengali";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface NavbarProps {
  categories: Category[];
  activeCategorySlug?: string;
}

export default function Navbar({ categories, activeCategorySlug }: NavbarProps) {
  const pathname = usePathname();
  const banglaDate = getBengaliDate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAllActive = pathname === "/" && !activeCategorySlug;

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    toast.success("সফলভাবে সাইন আউট করা হয়েছে");
  };

  return (
    <header className="w-full bg-[#fafcfa] border-b border-[#e1e8e1] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        {/* Top Bar: Logo, Date & Auth CTA */}
        <div className="flex items-center justify-between py-3 border-b border-[#f0f5f0]">
          {/* Logo & Bengali Date */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#05893e] flex items-center justify-center p-2 shadow-sm flex-shrink-0 group-hover:bg-[#047f39] transition-colors">
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Image
                  src="/logo-icon.png"
                  alt="বাজার দর"
                  width={20}
                  height={20}
                  unoptimized
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[20px] font-extrabold tracking-tight text-[#1d271f] leading-none mb-1">
                বাজার দর
              </span>
              <span className="text-[12px] text-[#657568] font-medium leading-none">
                {banglaDate}
              </span>
            </div>
          </Link>

          {/* Right: Auth buttons or User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-black/5 transition"
                >
                  {user.image ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#e2e8e2]">
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                      {user.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-[#1d271f] max-w-[120px] truncate">
                    {user.name ? user.name.split(" ")[0] : "ব্যবহারকারী"}
                  </span>
                  <span className="text-[10px] text-[#6b7280]">▾</span>
                </button>

                {/* User Dropdown matching exact Figma design */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e2e8e2] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="mb-3">
                      <p className="text-sm font-bold text-[#1d271f] truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#9ca3af] truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 py-1.5 text-sm font-medium text-[#1d271f] hover:text-[#088743] transition-colors"
                      >
                        <span className="text-sm text-[#475569]">👤</span>
                        <span>আমার প্রোফাইল</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 py-1.5 text-sm font-medium text-[#dc2626] hover:opacity-80 transition-colors"
                      >
                        <span className="text-sm text-[#dc2626]">↩</span>
                        <span>সাইন আউট</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/signin"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-[#1d271f] hover:text-[#05893e] hover:bg-[#f0f5f0] rounded-xl transition-all"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-[#f3fbf4] bg-[#05893e] hover:bg-[#047f39] rounded-xl shadow-sm transition-all"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Category Navigation Row */}
        <nav className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              isAllActive
                ? "bg-[#05893e] text-white shadow-sm font-semibold"
                : "text-[#1d271f] hover:bg-[#f0f5f0] bg-white border border-[#e1e8e1]"
            }`}
          >
            <span>🏠</span>
            <span>সব পণ্য</span>
          </Link>
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#05893e] text-white shadow-sm font-semibold"
                    : "text-[#1d271f] hover:bg-[#f0f5f0] bg-white border border-[#e1e8e1]"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
