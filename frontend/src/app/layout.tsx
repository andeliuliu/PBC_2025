import type { Metadata } from "next";
import { Inria_Serif, Inter } from "next/font/google";
import { NEXT_PUBLIC_URL } from "../config";
import Footer from "src/components/Footer";
import "./global.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import Header from "src/components/Header";
const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const OnchainProviders = dynamic(
  () => import("src/components/OnchainProviders"),
  {
    ssr: false,
  }
);

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Orchid - Luxury Marketplace",
  description: "Shop luxury items from top designers",
  openGraph: {
    title: "Orchid - Luxury Marketplace",
    description: "Shop luxury items from top designers",
    images: [`${NEXT_PUBLIC_URL}/logo.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inriaSerif.className} ${inter.className}`}>
      <body className="flex items-center justify-center text-[#030712]">
        <OnchainProviders>
          <div className="min-h-screen w-full p-4 bg-[#F2EDE9]">
            <div className="mx-auto w-[480px] h-[calc(100vh-32px)] relative bg-[#F2EDE9] shadow-xl rounded-3xl px-4 overflow-hidden">
              <Header />
              <div className="bg-[#F2EDE9] overflow-y-auto h-[calc(100vh-180px)] pb-20">
                {children}
              </div>
              <Footer />
            </div>
          </div>
        </OnchainProviders>
      </body>
    </html>
  );
}
