import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Nav } from "@/components/ui/Nav";
import { Providers } from "@/components/Providers";
import { brand } from "@/lib/brand";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Orivana — ${brand.tagline}`,
    template: "%s | Orivana",
  },
  description: brand.description,
  openGraph: {
    title: "Orivana",
    description: brand.tagline,
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[var(--color-bg)] font-sans text-[var(--color-text)] antialiased">
        <Providers>
          <Nav />
          <main className="page-enter">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
