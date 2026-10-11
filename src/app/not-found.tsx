import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/api";

export const metadata = {
  title: "পৃষ্ঠাটি পাওয়া যায়নি (৪০৪) - বাজার দর",
  description: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।",
};

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#edf2ed]">
      <Navbar categories={categories} />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="max-w-[480px] w-full bg-white border border-[#e2e8e2] rounded-3xl p-8 sm:p-10 text-center shadow-xs space-y-6">
          {/* 404 Illustration Badge */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#f4f7f4] flex items-center justify-center text-5xl">
            🛒
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d271f]">
              404 Not Found
            </h1>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-center">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#088743] hover:bg-[#077339] text-white font-bold text-sm transition-all shadow-xs"
            >
              মূল পাতায় ফিরে যান
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
