import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "./structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pokesleep-iv-comparator.vercel.app"),
  title: {
    default: "ポケスリ個体値比較 - Pokémon Sleep IV Comparator",
    template: "%s | ポケスリ個体値比較",
  },
  description:
    "ポケモンスリープの個体値を簡単に比較できるツールです。複数のポケモンの個体値を一度に比較し、最適な育成を支援します。",
  keywords: [
    "ポケモンスリープ",
    "Pokémon Sleep",
    "ポケスリ",
    "個体値",
    "IV",
    "比較",
    "ツール",
    "育成",
    "攻略",
  ],
  authors: [{ name: "Asaki256" }],
  creator: "Asaki256",
  publisher: "Asaki256",
  alternates: {
    canonical: "https://pokesleep-iv-comparator.vercel.app",
    languages: {
      "ja-JP": "https://pokesleep-iv-comparator.vercel.app",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://pokesleep-iv-comparator.vercel.app",
    siteName: "ポケスリ個体値比較",
    title: "ポケスリ個体値比較 - Pokémon Sleep IV Comparator",
    description:
      "ポケモンスリープの個体値を簡単に比較できるツールです。複数のポケモンの個体値を一度に比較し、最適な育成を支援します。",
    images: [
      {
        url: "https://pokesleep-iv-comparator.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ポケスリ個体値比較",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ポケスリ個体値比較 - Pokémon Sleep IV Comparator",
    description:
      "ポケモンスリープの個体値を簡単に比較できるツールです。複数のポケモンの個体値を一度に比較し、最適な育成を支援します。",
    images: ["https://pokesleep-iv-comparator.vercel.app/og-image.png"],
    creator: "@Asaki256",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "https://pokesleep-iv-comparator.vercel.app/favicon.ico", sizes: "any" },
      { url: "https://pokesleep-iv-comparator.vercel.app/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "https://pokesleep-iv-comparator.vercel.app/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "https://pokesleep-iv-comparator.vercel.app/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ポケスリIV比較",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="DVy7jur6OcUHxGHsiFBOh-eDqXQfSPK3odti0T0pR7w" />
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
