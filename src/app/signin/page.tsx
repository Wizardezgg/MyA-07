import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import SignInForm from "@/components/SignInForm";

export const metadata = {
  title: "সাইন ইন - বাজার দর (BazarDor)",
  description: "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।",
};

export default async function SignInPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#edf2ed]">
      <Navbar categories={categories} />
      <Ticker products={products} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="h-96 w-full max-w-[420px] bg-white rounded-3xl animate-pulse" />
          }
        >
          <SignInForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
