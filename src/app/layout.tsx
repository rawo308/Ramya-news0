import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-HL5NJ4EW7F";

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-heading",
  subsets: ["arabic"],
  weight: ["500", "600", "700", "800"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-body",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const description = "آخر الأخبار العاجلة من لبنان والعالم أولاً بأول.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "رامية نيوز | Ramyah News",
    template: "%s | رامية نيوز",
  },
  description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "ar",
    siteName: "رامية نيوز",
    title: "رامية نيوز | Ramyah News",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "رامية نيوز | Ramyah News",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#c8102e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5416586187160130"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${notoKufiArabic.variable} ${notoSansArabic.variable} antialiased font-body`}
      >
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
