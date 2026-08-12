"use client";

import { useEffect } from "react";

const NATIVE_SCRIPT_URL =
  "https://pl30210030.effectivecpmnetwork.com/ff81d04a8be0dcae95c0bc10987ddd89/invoke.js";
const NATIVE_CONTAINER_ID = "container-ff81d04a8be0dcae95c0bc10987ddd89";

export function NativeAdBar() {
  useEffect(() => {
    const container = document.getElementById(NATIVE_CONTAINER_ID);
    if (!container) return;

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = NATIVE_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-native-ad", "ramya");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-secondary/20 p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        إعلان مدمج
      </p>
      <div className="flex justify-center">
        <div id={NATIVE_CONTAINER_ID} className="w-full max-w-full" />
      </div>
    </div>
  );
}
