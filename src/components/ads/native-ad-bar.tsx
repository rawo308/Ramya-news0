"use client";

import Script from "next/script";
import { NATIVE_BAR } from "@/lib/ads";

export function NativeAdBar() {
  return (
    <div className="my-6 flex justify-center overflow-hidden">
      <div id={NATIVE_BAR.containerId} className="w-full max-w-full" />
      <Script src={NATIVE_BAR.src} strategy="lazyOnload" data-cfasync="false" />
    </div>
  );
}
