"use client";

import Script from "next/script";
import { useIsAdminPage } from "@/lib/use-is-admin-page";

// AdSense + popunder scripts — must not load on admin pages.
export function AdHeadScripts() {
  if (useIsAdminPage()) return null;

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5416586187160130"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}
