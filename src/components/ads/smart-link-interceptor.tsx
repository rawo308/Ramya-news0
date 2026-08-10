'use client';

import { useEffect } from "react";

const SMART_LINK_URL = "https://www.effectivecpmnetwork.com/vpe6gx93k1?key=91e723d283c4f5b779d906ccc3e9fe3d";
const STORAGE_KEY = "ramya-smart-link-used";

export function SmartLinkInterceptor() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const currentUrl = new URL(window.location.href);

      try {
        const targetUrl = new URL(href, window.location.href);
        const alreadyUsed = window.localStorage.getItem(STORAGE_KEY) === "1";
        const isArticleLink = targetUrl.pathname.startsWith("/article/");
        const isSamePage = targetUrl.pathname === currentUrl.pathname;
        const isInternal = targetUrl.origin === currentUrl.origin;

        if (isInternal && isArticleLink && !isSamePage && !alreadyUsed) {
          event.preventDefault();
          event.stopPropagation();
          window.localStorage.setItem(STORAGE_KEY, "1");
          window.location.assign(SMART_LINK_URL);
        }
      } catch {
        // Ignore invalid URLs.
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
