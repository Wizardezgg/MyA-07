"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  message?: string;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  message = "এই পৃষ্ঠাটি দেখতে দয়া করে সাইন ইন করুন",
  redirectTo = "/signin",
}: AuthGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error(message, {
          id: "auth-guard-redirect",
          duration: 3500,
        });
        router.replace(redirectTo);
      } else {
        setChecked(true);
      }
    }
  }, [user, loading, router, message, redirectTo]);

  // While checking auth state, show a clean skeleton / spinner
  if (loading || !checked) {
    return (
      <div className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-6 py-16 w-full flex flex-col items-center justify-center min-h-[45vh]">
        <div className="w-10 h-10 border-4 border-[#05893e] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-[#657568]">যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  return <>{children}</>;
}
