import { useEffect, useState } from "react";
import type { DisplayArticle } from "@/lib/format";

export function useArticleSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<DisplayArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    setLoading(true);

    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: DisplayArticle[]) => setResults(data))
        .catch((err) => {
          if (!(err instanceof DOMException && err.name === "AbortError")) setResults([]);
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, enabled]);

  return { results, loading };
}
