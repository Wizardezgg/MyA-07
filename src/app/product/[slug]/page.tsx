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
  // In Bazar Dor:
  // Price Rise (দাম বেড়েছে / isUp) = Red alert badge (▲)
  // Price Fall (দাম কমেছে / isDown) = Green savings badge (▼)
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const changeColor = isUp ? "text-[#d03739]" : isDown ? "text-[#088743]" : "text-[#657568]";
  const changeBg = isUp ? "bg-[#fdeeed]" : isDown ? "bg-[#eaf8ef]" : "bg-[#f0f5f0]";
  const arrow = isUp ? "▲" : isDown ? "▼" : "—";
  const changeDiff = product.yesterday ? Math.abs(product.today - product.yesterday) : 0;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#edf2ed]">
      <Navbar categories={categories} activeCategorySlug={product.category} />
      <Ticker products={allProducts} />

      <AuthGuard message="পণ্যটির বিস্তারিত দেখতে দয়া করে সাইন ইন করুন">
        <main className="flex-1 max-w-[1040px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
          {/* Breadcrumb Navigation: হোম > চাল > বাটাম সাইজ চাল */}
          <nav className="flex items-center gap-2 text-sm text-[#6b7280]">
            <Link href="/" className="hover:text-[#088743] transition-colors">
              হোম
            </Link>
            <span className="text-xs text-[#9ca3af]">&gt;</span>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-[#088743] transition-colors"
            >
              {product.categoryNameBn || "ক্যাটাগরি"}
            </Link>
            <span className="text-xs text-[#9ca3af]">&gt;</span>
            <span className="text-[#1d271f] font-medium">{product.nameBn}</span>
          </nav>

          {/* Top Summary Card */}
          <div className="bg-white border border-[#e2e8e2] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
            {/* Left: Icon, Name, Category/Unit, Price Change Subtitle */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f4f7f4] flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
                {product.image || product.categoryIcon || "🍚"}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d271f]">
                  {product.nameBn}
                </h1>
                <p className="text-xs sm:text-sm text-[#6b7280]">
                  {formatBnUnit(product.unit)} · {product.categoryNameBn || "ক্যাটাগরি"}
                </p>
                {changeDiff > 0 && (
                  <p className="text-xs text-[#4b5563] pt-0.5">
                    গতকালের তুলনায় আজ দাম{" "}
                    <span className="font-semibold text-[#1d271f]">
                      {isUp ? "বেড়েছে" : "কমেছে"}
                    </span>{" "}
                    · {toBnNum(changeDiff)} টাকা
                  </p>
                )}
              </div>
            </div>

            {/* Right: Boxed "আজকের দাম" Card */}
            <div className="bg-[#f4f7f4] rounded-2xl p-4 sm:p-5 text-center min-w-[140px] w-full sm:w-auto flex flex-col items-center justify-center self-stretch sm:self-auto">
              <span className="text-xs text-[#6b7280]">আজকের দাম</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1d271f] my-0.5">
                {toBnNum(product.today)}
              </div>
              <span className="text-xs text-[#6b7280] mb-2">
                টাকা / {formatBnUnit(product.unit).replace("প্রতি ", "")}
              </span>
              <div
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${changeBg} ${changeColor}`}
              >
                <span>{arrow}</span>
                <span>{toBnNum(product.change?.pct || 0)}%</span>
              </div>
            </div>
          </div>

          {/* Price Summary 3 Individual Stats Cards: দামের সারসংক্ষেপ */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#1d271f]">
              দামের সারসংক্ষেপ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Lowest Price Card */}
              <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#6b7280]">সর্বনিম্ন দাম</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#088743] mt-2">
                    {formatBnPrice(lowestPrice)}
                  </div>
                </div>
                <span className="text-xs text-[#9ca3af] mt-4 block">
                  সবচেয়ে কম দামের বাজার
                </span>
              </div>

              {/* Highest Price Card */}
              <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#6b7280]">সর্বাধিক দাম</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#d03739] mt-2">
                    {formatBnPrice(highestPrice)}
                  </div>
                </div>
                <span className="text-xs text-[#9ca3af] mt-4 block">
                  সবচেয়ে বেশি দামের বাজার
                </span>
              </div>

              {/* Average Price Card */}
              <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#6b7280]">গড় দাম</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#088743] mt-2">
                    {formatBnPrice(avgPrice)}
                  </div>
                </div>
                <span className="text-xs text-[#9ca3af] mt-4 block">
                  {formatBnUnit(product.unit)}-এর হিসাবে
                </span>
              </div>
            </div>
          </section>

          {/* Market Breakdown Table Section: বাজারভিত্তিক আজকের দাম */}
          <section className="bg-white border border-[#e2e8e2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-[#1d271f]">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8e2] text-xs font-semibold text-[#6b7280]">
                    <th className="py-3 px-3 text-left">বাজার</th>
                    <th className="py-3 px-3 text-left">বিভাগ</th>
                    <th className="py-3 px-3 text-right">সর্বনিম্ন</th>
                    <th className="py-3 px-3 text-right">সর্বাধিক</th>
                    <th className="py-3 px-3 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4f0] text-sm text-[#1d271f]">
                  {markets.map((m, idx) => {
                    const avg = (m.min + m.max) / 2;
                    const avgFormatted =
                      avg % 1 === 0 ? toBnNum(avg) : toBnNum(avg.toFixed(2));

                    return (
                      <tr
                        key={`${m.market}-${idx}`}
                        className="hover:bg-[#f9faf9] transition-colors"
                      >
                        <td className="py-3.5 px-3 font-medium">
                          {m.market}
                        </td>
                        <td className="py-3.5 px-3 text-[#6b7280]">
                          {m.division}
                        </td>
                        <td className="py-3.5 px-3 text-right text-[#4b5563]">
                          {toBnNum(m.min)} টাকা
                        </td>
                        <td className="py-3.5 px-3 text-right text-[#4b5563]">
                          {toBnNum(m.max)} টাকা
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-[#1d271f]">
                          {avgFormatted} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </AuthGuard>

      <Footer />
    </div>
  );
}
