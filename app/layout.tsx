import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Investment Portal - Portfolio Management",
  description:
    "Secure access to your investment portfolio, financial documents, and performance analytics.",
  keywords:
    "real estate investment, property investment, investor portal, financial documents, investment portfolio",
  authors: [{ name: "Investment Portal" }],
  creator: "Investment Portal",
  publisher: "Investment Portal",
  applicationName: "Investment Portfolio Management",
  category: "Finance",
  classification: "Investment Platform",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Investment Portfolio Management",
    title: "Investment Portal - Portfolio Management",
    description:
      "Secure access to your investment portfolio and financial documents.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Portal - Portfolio Management",
    description:
      "Secure access to your investment portfolio and financial documents.",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="theme-color" content="#686868" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Investment Portal" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div id="root">{children}</div>
          <div id="modal-root"></div>
        </AuthProvider>
      </body>
    </html>
  );
}
