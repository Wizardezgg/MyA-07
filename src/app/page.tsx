import { getCategories, getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { toBnNum } from "@/lib/bengali";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  // Section A: Top 6 Risers (dir === "up", sorted descending by pct)
  const risers = products
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // Section B: Top 6 Fallers (dir === "down", sorted descending by absolute pct)
  const fallers = products
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar categories={categories} />
      <Ticker products={products} />
      <Hero />

      <main className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-6 py-10 w-full space-y-12">
        {/* Section A — “আজ দাম বেড়েছে ▲”: Top 6 risers */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#eaf8ef] text-[#1a9951] font-bold text-sm">
              ▲
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d271f]">
              আজ দাম বেড়েছে
            </h2>
            <span className="text-xs text-[#657568] ml-auto">
              সর্বোচ্চ {toBnNum(risers.length)}টি পণ্য
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {risers.map((product) => (
              <ProductCard key={`riser-${product.id}`} product={product} />
            ))}
          </div>
        </section>

        {/* Section B — “আজ দাম কমেছে ▼”: Top 6 fallers */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#fdeeed] text-[#d03739] font-bold text-sm">
              ▼
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d271f]">
              আজ দাম কমেছে
            </h2>
            <span className="text-xs text-[#657568] ml-auto">
              সর্বোচ্চ {toBnNum(fallers.length)}টি পণ্য
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fallers.map((product) => (
              <ProductCard key={`faller-${product.id}`} product={product} />
            ))}
          </div>
        </section>

        {/* Section C — “সব পণ্য” with anchor id="সব-পণ্য" */}
        <section id="সব-পণ্য" className="scroll-mt-24 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6 border-b border-[#e1e8e1] pb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d271f]">
                সব পণ্য
              </h2>
              <p className="text-sm text-[#657568] mt-1">
                নিত্যপ্রয়োজনীয় সকল পণ্যের হালনাগাদ বাজারদর
              </p>
            </div>
            <div className="text-sm font-semibold text-[#05893e] bg-[#eaf8ef] px-3 py-1 rounded-full w-fit">
              মোট {toBnNum(products.length)}টি পণ্য দেখানো হচ্ছে
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={`all-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
