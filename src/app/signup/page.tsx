import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/SignUpForm";

export const metadata = {
  title: "অ্যাকাউন্ট তৈরি করুন - বাজার দর (BazarDor)",
  description: "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।",
};

export default async function SignUpPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#edf2ed]">
      <Navbar categories={categories} />
      <Ticker products={products} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8">
        <Suspense
          fallback={
            <div className="h-96 w-full max-w-[420px] bg-white rounded-3xl animate-pulse" />
          }
        >
          <SignUpForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
