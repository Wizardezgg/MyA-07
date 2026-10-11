"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfileView() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("অনুগ্রহ করে একটি নাম লিখুন");
      return;
    }

    setLoading(true);

    try {
      try {
        await (authClient as unknown as { updateUser?: (args: { name: string }) => Promise<unknown> })
          .updateUser?.({ name: name.trim() });
      } catch (authErr) {
        console.warn("BetterAuth client update fallback:", authErr);
      }

      await updateUser({ name: name.trim() });

      toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
    } catch {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch {
      // Ignore
    }
    logout();
    toast.success("সফলভাবে সাইন আউট হয়েছে!");
    router.replace("/");
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d271f]">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs sm:text-sm text-[#4b5563] mt-1.5 font-normal">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* Card 1: User Summary Card */}
      <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar Image */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#eaf8ef] flex-shrink-0 flex items-center justify-center border border-[#e2e8e2]">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-[#eaf8ef] text-[#088743] font-bold text-2xl flex items-center justify-center">
                {user.name ? user.name.slice(0, 1).toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1d271f]">
              {user.name || "ব্যবহারকারী"}
            </h2>
            <p className="text-xs sm:text-sm text-[#657568] mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button: ← সাইন আউট */}
        <button
          type="button"
          onClick={handleSignOut}
          className="px-3.5 py-2 border border-[#fca5a5] text-[#dc2626] hover:bg-[#fef2f2] rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
        >
          <span>←</span>
          <span>সাইন আউট</span>
        </button>
      </div>

      {/* Card 2: Update Information Form */}
      <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-[#1d271f]">
          তথ্য
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1d271f] mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] focus:border-[#088743] focus:outline-none focus:ring-1 focus:ring-[#088743] text-sm text-[#1d271f] bg-[#fafafa]/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-[#088743] hover:bg-[#07793c] text-white font-semibold text-sm rounded-xl transition duration-150 shadow-sm disabled:opacity-70 mt-2"
          >
            {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
          </button>
        </form>
      </div>
    </div>
  );
}
