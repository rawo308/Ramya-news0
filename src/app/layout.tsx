import type { Metadata } from "next";
import { Noto_Kufi_Arabic, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "رامية نيوز | Ramyah News",
  description: "آخر الأخبار العاجلة من لبنان والعالم أولاً بأول.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${notoKufiArabic.variable} ${notoSansArabic.variable} antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
