"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useArticleSearch } from "@/lib/use-article-search";

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { results, loading } = useArticleSearch(query, open);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function handleSelect(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/article/${slug}`);
  }

  function renderResults() {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          جارٍ البحث...
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <p className="px-3 py-6 text-center text-sm text-muted-foreground">
          {query ? "لا توجد نتائج" : "لا توجد مقالات بعد"}
        </p>
      );
    }

    return (
      <>
        <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground">
          {query ? "نتائج البحث" : "أحدث المقالات"}
        </p>
        <ul className="flex flex-col">
          {results.map((article) => (
            <li key={article.id}>
              <button
                type="button"
                onClick={() => handleSelect(article.slug)}
                className="flex w-full items-center gap-3 px-3 py-2 text-start hover:bg-accent"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={article.image} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold">{article.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {article.category} · {article.time}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div ref={containerRef}>
      {/* desktop */}
      <div className="relative hidden md:block">
        {open ? (
          <Input
            autoFocus
            placeholder="ابحث عن خبر..."
            className="w-64"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        ) : (
          <Button variant="ghost" size="icon" aria-label="بحث" onClick={() => setOpen(true)}>
            <Search className="size-5" />
          </Button>
        )}
        {open && (
          <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-md border bg-background shadow-lg">
            {renderResults()}
          </div>
        )}
      </div>

      {/* mobile */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="بحث"
        className="md:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Search className="size-5" />}
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t bg-background px-4 py-3 shadow-lg md:hidden">
          <Input
            autoFocus
            placeholder="ابحث عن خبر..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-2 max-h-96 overflow-y-auto rounded-md border">{renderResults()}</div>
        </div>
      )}
    </div>
  );
}
