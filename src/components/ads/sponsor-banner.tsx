import Image from "next/image";
import Link from "next/link";
import { idevelopitLink } from "@/lib/ads";

const BRAND_LIME = "#C5FA03";

export function SponsorBanner() {
  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link
          href={idevelopitLink("banner", "logo")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-2.5"
        >
          <Image
            src="/idevelopit-logo.png"
            alt="iDevelopIt"
            width={32}
            height={32}
            className="shrink-0 rounded-full"
          />
          <span className="truncate text-sm font-semibold text-white">
            هذا الموقع برعاية <span style={{ color: BRAND_LIME }}>iDevelopIt</span>
            <span className="hidden font-normal text-white/70 sm:inline">
              {" "}
              — مواقع سريعة، تصميم احترافي، نتائج فعلية
            </span>
          </span>
        </Link>
        <Link
          href={idevelopitLink("banner", "cta_button")}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold text-black"
          style={{ backgroundColor: BRAND_LIME }}
        >
          تواصل معنا
        </Link>
      </div>
    </div>
  );
}
