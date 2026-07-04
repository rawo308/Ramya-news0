import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaginationNav({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav
      aria-label="ترقيم الصفحات"
      className="mx-auto flex max-w-6xl items-center justify-center gap-1.5 px-4 pb-12"
    >
      <Link
        href={pageHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium hover:bg-accent",
          page === 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight className="size-4" />
        السابق
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          className={cn(
            "flex h-9 min-w-9 items-center justify-center rounded-md border text-sm font-medium hover:bg-accent",
            p === page && "border-primary bg-primary text-primary-foreground hover:bg-primary",
          )}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      <Link
        href={pageHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium hover:bg-accent",
          page === totalPages && "pointer-events-none opacity-40",
        )}
      >
        التالي
        <ChevronLeft className="size-4" />
      </Link>
    </nav>
  );
}
