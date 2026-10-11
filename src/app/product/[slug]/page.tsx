import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getProducts, getProductBySlugOrId } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { toBnNum, formatBnPrice, formatBnUnit } from "@/lib/bengali";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug || String(product.id),
  }));
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [categories, allProducts, product] = await Promise.all([
    getCategories(),
    getProducts(),
    getProductBySlugOrId(slug),
  ]);

  if (!product) {
    notFound();
  }

  // Calculate market price statistics
  const markets = product.markets || [];
  const minPrices = markets.map((m) => m.min).filter((n) => typeof n === "number");
  const maxPrices = markets.map((m) => m.max).filter((n) => typeof n === "number");

  const lowestPrice = minPrices.length > 0 ? Math.min(...minPrices) : product.today;
  const highestPrice = maxPrices.length > 0 ? Math.max(...maxPrices) : product.today;

  // Average price across all markets
  const allValues = [...minPrices, ...maxPrices];
  const avgPrice =
    allValues.length > 0
      ? Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length)
      : product.today;

  // Price change direction and styling
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const changeColor = isUp ? "text-[#1a9951]" : isDown ? "text-[#d03739]" : "text-[#657568]";
  const changeBg = isUp ? "bg-[#eaf8ef]" : isDown ? "bg-[#fdeeed]" : "bg-[#f0f5f0]";
  const arrow = isUp ? "▲" : isDown ? "▼" : "—";
  const changeDiff = product.yesterday ? Math.abs(product.today - product.yesterday) : 0;

  return (
    <div className="flex-1 flex flex-col">
      <Navbar categories={categories} activeCategorySlug={product.category} />
      <Ticker products={allProducts} />

      <AuthGuard>
        <main className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
          {/* Breadcrumb Navigation: হোম / [ক্যাটাগরি] / [পণ্যের নাম] */}
          <nav className="flex items-center gap-2 text-sm text-[#657568]">
            <Link href="/" className="hover:text-[#05893e] transition-colors">
              হোম
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-[#05893e] transition-colors"
            >
              {product.categoryNameBn || "ক্যাটাগরি"}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1d271f]">{product.nameBn}</span>
          </nav>

          {/* Top Summary Card */}
          <div className="bg-white border border-[#e1e8e1] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#fafcfa] border border-[#e1e8e1] flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0 shadow-inner">
                {product.image || product.categoryIcon || "🛒"}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d271f]">
                  {product.nameBn}
                </h1>
                <p className="text-sm font-medium text-[#657568] mt-1">
                  {formatBnUnit(product.unit)} · {product.categoryNameBn || "ক্যাটাগরি"}
                </p>
                {changeDiff > 0 && (
                  <p className="text-xs font-semibold text-[#05893e] mt-2 bg-[#eaf8ef] px-2.5 py-1 rounded-md inline-block">
                    গতকালের তুলনায় আজ {isUp ? "দাম বেড়েছে" : "দাম কমেছে"} · {toBnNum(changeDiff)} টাকা
                  </p>
                )}
              </div>
            </div>

            {/* Today's Price Highlight */}
            <div className="flex flex-col items-start md:items-end bg-[#fafcfa] md:bg-transparent p-4 md:p-0 rounded-xl border md:border-none border-[#e1e8e1] w-full md:w-auto">
              <span className="text-xs font-semibold text-[#657568]">আজকের গড় দাম</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#05893e]">
                  {toBnNum(product.today)}
                </span>
                <span className="text-sm font-semibold text-[#657568]">
                  টাকা / {formatBnUnit(product.unit).replace("প্রতি ", "")}
                </span>
              </div>
              <div
                className={`mt-2 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${changeBg} ${changeColor}`}
              >
                <span>{arrow}</span>
                <span>{toBnNum(product.change?.pct || 0)}%</span>
              </div>
            </div>
          </div>

          {/* Price Summary 3 Stats Cards */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1d271f]">দামের সারসংক্ষেপ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Lowest Price */}
              <div className="bg-white border border-[#e1e8e1] rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-medium text-[#657568]">সর্বনিম্ন দাম</span>
                <div className="text-2xl font-bold text-[#1d271f] mt-1">
                  {formatBnPrice(lowestPrice)}
                </div>
                <span className="text-xs text-[#657568] mt-2 block">
                  সবচেয়ে কম দামের বাজার
                </span>
              </div>

              {/* Highest Price */}
              <div className="bg-white border border-[#e1e8e1] rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-medium text-[#657568]">সর্বাধিক দাম</span>
                <div className="text-2xl font-bold text-[#1d271f] mt-1">
                  {formatBnPrice(highestPrice)}
                </div>
                <span className="text-xs text-[#657568] mt-2 block">
                  সবচেয়ে বেশি দামের বাজার
                </span>
              </div>

              {/* Average Price */}
              <div className="bg-white border border-[#e1e8e1] rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-medium text-[#657568]">গড় দাম</span>
                <div className="text-2xl font-bold text-[#05893e] mt-1">
                  {formatBnPrice(avgPrice)}
                </div>
                <span className="text-xs text-[#657568] mt-2 block">
                  {formatBnUnit(product.unit)}-এর হিসাবে
                </span>
              </div>
            </div>
          </section>

          {/* Market Breakdown Table: বাজারভিত্তিক আজকের দাম */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1d271f]">
                বাজারভিত্তিক আজকের দাম
              </h2>
              <span className="text-xs text-[#657568]">
                মোট {toBnNum(markets.length)}টি বাজার
              </span>
            </div>

            <div className="bg-white border border-[#e1e8e1] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f0f5f0] text-[#1d271f] text-xs font-bold uppercase tracking-wider border-b border-[#e1e8e1]">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">বাজার</th>
                      <th className="py-3.5 px-4 sm:px-6">বিভাগ</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">সর্বনিম্ন</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">সর্বাধিক</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">গড়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f5f0] text-[#1d271f]">
                    {markets.map((m, idx) => {
                      const marketAvg = Math.round((m.min + m.max) / 2);
                      return (
                        <tr
                          key={`${m.market}-${idx}`}
                          className="hover:bg-[#fafcfa] transition-colors"
                        >
                          <td className="py-3.5 px-4 sm:px-6 font-semibold">
                            {m.market}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-[#657568]">
                            {m.division}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            {formatBnPrice(m.min)}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            {formatBnPrice(m.max)}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-[#05893e]">
                            {formatBnPrice(marketAvg)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </AuthGuard>

      <Footer />
    </div>
  );
}
