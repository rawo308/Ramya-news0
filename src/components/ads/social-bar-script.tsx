"use client";

import Script from "next/script";
import { useIsAdminPage } from "@/lib/use-is-admin-page";

// Social bar ad — must not load on admin pages.
export function SocialBarScript() {
  if (useIsAdminPage()) return null;

  return (
    <Script
      async
      src="https://pl30810473.effectivecpmnetwork.com/11/a7/d4/11a7d4ec346ad6b06ae637b90eaaec2d.js"
      strategy="afterInteractive"
    />
  );
}
