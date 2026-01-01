import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteInfo, getMenu } from "@/lib/wordpress";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Headless Store - WordPress + Next.js",
  description: "A headless CMS store powered by WordPress and Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site info and menu for header
  const siteInfo = await getSiteInfo();
  const menuItems = await getMenu();

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          <Header 
            siteName={siteInfo?.name} 
            logo={siteInfo?.logo} 
            menuItems={menuItems} 
          />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
