import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import CategoryProductList from "@/components/CategoryProductList";
import { toBnNum } from "@/lib/bengali";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, allProducts, categoryProducts] = await Promise.all([
    getCategories(),
    getProducts(),
    getProducts(slug),
  ]);

  const currentCategory = categories.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase()
  );

  // If category slug does not exist at all, return friendly 404
  if (!currentCategory && categoryProducts.length === 0) {
    notFound();
  }

  const categoryName = currentCategory?.nameBn || slug;
  const categoryIcon = currentCategory?.icon || "🛒";

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#edf2ed]">
      <Navbar categories={categories} activeCategorySlug={slug} />
      <Ticker products={allProducts} />

      <main className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* Category Header matching exact Penpot design */}
        <div className="flex items-center gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#e2e8e2] shadow-xs">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f4f7f4] flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
            {categoryIcon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d271f]">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-[#657568] mt-1">
              {toBnNum(categoryProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Empty State vs Product List */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e1e8e1] px-4 shadow-sm">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-[#1d271f] mb-2">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি
            </h2>
            <p className="text-sm text-[#657568] max-w-md mx-auto mb-6">
              শীঘ্রই এই ক্যাটাগরিতে নতুন তথ্য যুক্ত করা হবে। অনুগ্রহ করে হোম পেজে ফিরে যান বা অন্য ক্যাটাগরি দেখুন।
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#05893e] hover:bg-[#047f39] text-[#f3fbf4] font-semibold text-sm shadow-sm transition-all"
            >
              <span>←</span>
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        ) : (
          <CategoryProductList initialProducts={categoryProducts} />
        )}
      </main>

      <Footer />
    </div>
  );
}
