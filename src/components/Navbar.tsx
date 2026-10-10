"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";
import { getBengaliDate } from "@/lib/bengali";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface NavbarProps {
  categories: Category[];
  activeCategorySlug?: string;
}

export default function Navbar({ categories, activeCategorySlug }: NavbarProps) {
  const banglaDate = getBengaliDate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d271f] flex items-center gap-1.5">
                বাজার দর
              </span>
              <span className="text-xs text-[#657568] font-medium">
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#e1e8e1] hover:border-[#05893e] hover:bg-[#f0f5f0] transition-all bg-white"
                >
                  <div className="w-7 h-7 rounded-full bg-[#eaf8ef] text-[#05893e] font-bold text-xs flex items-center justify-center border border-[#c3d4c5]">
                    {user.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-semibold text-[#1d271f] max-w-[100px] truncate">
                    {user.name || "ব্যবহারকারী"}
                  </span>
                  <span className="text-xs text-[#657568]">▾</span>
                </button>

                {/* User Dropdown matching Penpot "Home - User Menu Open" */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-[#e1e8e1] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-[#f0f5f0]">
                      <p className="text-xs font-semibold text-[#1d271f] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#657568] truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1d271f] hover:bg-[#f0f5f0] hover:text-[#05893e] transition-colors"
                    >
                      <span>👤</span>
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-[#d03739] hover:bg-[#fdeeed] transition-colors"
                    >
                      <span>↩</span>
                      <span>সাইন আউট</span>
                    </button>
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
              !activeCategorySlug
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
