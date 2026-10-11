import { getCategories, getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import ProfileView from "@/components/ProfileView";

export const metadata = {
  title: "আমার প্রোফাইল - বাজার দর (BazarDor)",
  description: "আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।",
};

export default async function ProfilePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#edf2ed]">
      <Navbar categories={categories} />
      <Ticker products={products} />

      <AuthGuard message="প্রোফাইল দেখতে দয়া করে সাইন ইন করুন">
        <main className="flex-1 max-w-[620px] mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full space-y-6">
          <ProfileView />
        </main>
      </AuthGuard>

      <Footer />
    </div>
  );
}
