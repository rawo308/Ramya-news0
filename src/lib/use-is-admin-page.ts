"use client";

import { usePathname } from "next/navigation";

export function useIsAdminPage() {
  const pathname = usePathname();
  return pathname?.startsWith("/admin") ?? false;
}
