import "server-only";
import { createClient } from "@/lib/supabase/server";

// Read-only helpers for the public site.
//
// postgrest-js's type inference for a table embedded through a
// many-to-many join table (categories, via article_categories) collapses
// to `never` when selected directly as `categories(...)` off `articles`
// (a bug in the installed @supabase/postgrest-js version). Selecting the
// join table explicitly — `article_categories(categories(...))` — is two
// direct one-hop FK embeds instead and type-checks correctly, so every
// article query below goes through it and flattens the result to a plain
// `categories` array for callers.

type CategoryRef = { slug: string; label: string };

function toCategories(rows: { categories: CategoryRef | null }[]): CategoryRef[] {
  return rows.map((r) => r.categories).filter((c): c is CategoryRef => c !== null);
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").single();
  if (error) throw error;
  return data;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getTickerItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticker_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getFeaturedArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, article_categories(categories(slug, label))")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("featured_position", { ascending: true });
  if (error) throw error;
  return data.map(({ article_categories, ...article }) => ({
    ...article,
    categories: toCategories(article_categories),
  }));
}

export async function getCategoryArticles(categorySlug: string, page = 1, pageSize = 8) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Articles are linked to categories through the article_categories join
  // table, so an article can appear in more than one category's listing.
  const { data, error, count } = await supabase
    .from("articles")
    .select("*, article_categories!inner(categories!inner(slug, label))", { count: "exact" })
    .eq("status", "published")
    .eq("article_categories.categories.slug", categorySlug)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  const items = data.map(({ article_categories, ...article }) => ({
    ...article,
    categories: toCategories(article_categories),
  }));
  return { items, totalCount: count ?? 0, totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)) };
}

export async function getMostRead(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, article_categories(categories(slug, label))")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(({ article_categories, ...article }) => ({
    ...article,
    categories: toCategories(article_categories),
  }));
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, article_categories(categories(slug, label))")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { article_categories, ...article } = data;
  return { ...article, categories: toCategories(article_categories) };
}

export async function getRelatedArticles(categorySlugs: string[], excludeId: string, limit = 4) {
  if (categorySlugs.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, article_categories!inner(categories!inner(slug, label))")
    .eq("status", "published")
    .in("article_categories.categories.slug", categorySlugs)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(({ article_categories, ...article }) => ({
    ...article,
    categories: toCategories(article_categories),
  }));
}
