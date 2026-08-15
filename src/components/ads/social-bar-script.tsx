"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

// Social bar ad — must not load on admin pages.
export function SocialBarScript() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <Script
      async
      src="https://pl30810473.effectivecpmnetwork.com/11/a7/d4/11a7d4ec346ad6b06ae637b90eaaec2d.js"
      strategy="afterInteractive"
    />
  );
}
