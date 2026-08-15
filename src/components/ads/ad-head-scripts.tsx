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
      <script
        async
        src="https://pl30860750.effectivecpmnetwork.com/97/9a/5e/979a5e0b227fbede9ce721b7ac72b004.js"
      />
    </>
  );
}
