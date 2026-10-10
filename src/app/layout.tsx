import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর (BazarDor) - প্রয়োজনীয় পণ্যের দৈনিক বাজার দর",
  description: "আজকের চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার নির্ভরযোগ্য বাজারদর এক নজরে।",
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#fafcfa] text-[#1d271f]">
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
