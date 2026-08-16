"use client";

import { useEffect, useState } from "react";

const AD_MANAGER_URL = "https://js.wpadmngr.com/static/adManager.js";

export function BannerAd() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = AD_MANAGER_URL;
    script.setAttribute("data-admpid", "453235");
    document.body.appendChild(script);

    return () => script.remove();
  }, [mounted]);

  if (!mounted) return null;

  return <div data-banner-id="1499055" />;
}