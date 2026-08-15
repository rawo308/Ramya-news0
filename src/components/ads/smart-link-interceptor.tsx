'use client';

import { useEffect } from "react";
import { useIsAdminPage } from "@/lib/use-is-admin-page";

const SMART_LINK_URL = "https://www.effectivecpmnetwork.com/vpe6gx93k1?key=91e723d283c4f5b779d906ccc3e9fe3d";
const STORAGE_KEY = "ramya-smart-link-last-hit";
const SMART_LINK_COOLDOWN_MS = 6 * 60 * 60 * 1000;

export function SmartLinkInterceptor() {
  const isAdminPage = useIsAdminPage();

  useEffect(() => {
    if (isAdminPage) return;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const currentUrl = new URL(window.location.href);

      try {
        const targetUrl = new URL(href, window.location.href);
        const lastHitRaw = window.localStorage.getItem(STORAGE_KEY);
        const lastHit = lastHitRaw ? Number(lastHitRaw) : 0;
        const now = Date.now();
        const isInCooldown = Number.isFinite(lastHit) && now - lastHit < SMART_LINK_COOLDOWN_MS;
        const isArticleLink = targetUrl.pathname.startsWith("/article/");
        const isSamePage = targetUrl.pathname === currentUrl.pathname;
        const isInternal = targetUrl.origin === currentUrl.origin;

        if (isInternal && isArticleLink && !isSamePage && !isInCooldown) {
          event.preventDefault();
          event.stopPropagation();
          window.localStorage.setItem(STORAGE_KEY, String(now));
          window.location.assign(SMART_LINK_URL);
        }
      } catch {
        // Ignore invalid URLs.
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isAdminPage]);

  return null;
}
