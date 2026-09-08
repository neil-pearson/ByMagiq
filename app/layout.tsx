import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ByMagiq — AI that remembers",
    template: "%s",
  },
  description:
    "ByMagiq builds tools for AI that keeps its memory. Latticaxon, the flagship product, is a local-first second brain that compounds what you teach it.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/bymagiq-favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: "ByMagiq",
    title: "ByMagiq — AI that remembers",
    description:
      "ByMagiq builds tools for AI that keeps its memory. Latticaxon, the flagship product, is a local-first second brain that compounds what you teach it.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ByMagiq — AI that remembers",
    description:
      "ByMagiq builds tools for AI that keeps its memory. Latticaxon, the flagship product, is a local-first second brain that compounds what you teach it.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col font-body antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
