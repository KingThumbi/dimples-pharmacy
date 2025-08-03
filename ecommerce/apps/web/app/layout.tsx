import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Link from "next/link";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Dimples Pharmacy - Nairobi's Hope & Care",
    template: "%s | Dimples Pharmacy",
  },
  description:
    "Online pharmacy with prescription services and delivery in Kenya",
  keywords: ["pharmacy", "Kenya", "medication", "prescription", "healthcare"],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://dimplespharmacy.co.ke",
    siteName: "Dimples Pharmacy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dimples Pharmacy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-white">
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <footer className="bg-gray-50 py-8 mt-12 border-t">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>
                  © {new Date().getFullYear()} Dimples Pharmacy Ltd. All rights
                  reserved.
                </p>
                <p className="mt-2 text-sm">
                  Licensed by Kenya Pharmacy and Poisons Board
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <Link href="/terms" className="text-sm hover:underline">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-sm hover:underline">
                    Privacy Policy
                  </Link>
                  <Link href="/contact" className="text-sm hover:underline">
                    Contact Us
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
