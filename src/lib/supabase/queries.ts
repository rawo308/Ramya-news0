import "server-only";
import { cache } from "react";
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

type ArticleRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author: string;
  status: string;
  is_featured: boolean;
  featured_position: number | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  article_categories?: Array<{ categories: CategoryRef | null }>;
};

const RECENCY_WINDOWS_HOURS = [24, 48, 72] as const;
const KEYWORD_STOP_WORDS = new Set([
  "و",
  "في",
  "من",
  "على",
  "إلى",
  "عن",
  "مع",
  "ال",
  "أن",
  "هذا",
  "هذه",
  "لذلك",
  "ذلك",
  "كان",
  "أو",
  "ثم",
  "بعد",
  "قبل",
  "لكن",
  "حتى",
  "لأن",
  "لان",
  "ما",
  "كيف",
  "ماذا",
  "لم",
  "لن",
  "لا",
  "هل",
  "قد",
  "يوم",
  "عام",
  "سنة",
  "سنوات",
]);

function toCategories(rows: Array<{ categories: CategoryRef | null }> | undefined): CategoryRef[] {
  return (rows ?? []).map((r) => r.categories).filter((c): c is CategoryRef => c !== null);
}

function toArticlePayload(article: ArticleRecord) {
  const { article_categories, ...rest } = article;
  return {
    ...rest,
    categories: toCategories(article_categories),
  };
}

function getRecencyTier(publishedAt: string | null) {
  if (!publishedAt) return 0;

  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  if (ageHours <= 24) return 3;
  if (ageHours <= 48) return 2;
  if (ageHours <= 72) return 1;
  return 0;
}

function extractKeywords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !KEYWORD_STOP_WORDS.has(word))
    .filter((word, index, values) => values.indexOf(word) === index);
}

function getArticleRecencyScore(article: { published_at: string | null; created_at: string }) {
  const publishedAt = article.published_at ?? article.created_at;
  return getRecencyTier(publishedAt);
}

async function collectRecentArticles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  limit: number,
  windowHours?: number,
) {
  const collected = new Map<string, ArticleRecord>();

  const windows = windowHours ? [windowHours] : RECENCY_WINDOWS_HOURS;
  for (const hours of windows) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("articles")
      .select("*, article_categories(categories(slug, label))")
      .eq("status", "published")
      .gte("published_at", since)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    for (const item of data ?? []) {
      if (!collected.has(item.id)) {
        collected.set(item.id, item);
      }
    }

    if (collected.size >= limit) break;
  }

  if (collected.size < limit) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, article_categories(categories(slug, label))")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit * 3);

    if (error) throw error;

    for (const item of data ?? []) {
      if (!collected.has(item.id)) {
        collected.set(item.id, item);
      }
    }
  }

  return [...collected.values()].slice(0, limit).map(toArticlePayload);
}

function sortByRecencyAndViews<T extends { published_at: string | null; created_at: string; view_count: number }>(
  items: T[],
) {
  return [...items].sort((left, right) => {
    const leftTier = getRecencyTier(left.published_at ?? left.created_at);
    const rightTier = getRecencyTier(right.published_at ?? right.created_at);

    if (leftTier !== rightTier) {
      return rightTier - leftTier;
    }

    if (left.view_count !== right.view_count) {
      return right.view_count - left.view_count;
    }

    const leftTime = new Date(left.published_at ?? left.created_at).getTime();
    const rightTime = new Date(right.published_at ?? right.created_at).getTime();
    return rightTime - leftTime;
  });
}

function buildRelatedScore(
  candidate: ArticleRecord & { categories: CategoryRef[] },
  categorySlugs: string[],
  keywords: string[],
) {
  const categoryMatches = categorySlugs.filter((slug) => candidate.categories.some((item) => item.slug === slug));
  const keywordMatches = keywords.filter((word) => {
    const title = candidate.title.toLowerCase();
    const excerpt = candidate.excerpt.toLowerCase();
    const content = candidate.content.toLowerCase();
    return title.includes(word) || excerpt.includes(word) || content.includes(word);
  });

  return categoryMatches.length * 100 + keywordMatches.length * 10 + getRecencyTier(candidate.published_at ?? candidate.created_at) * 5;
}

function prioritizeRecentArticles<T extends { published_at: string | null; created_at: string }>(items: T[]) {
  const recent = items.filter((item) => getRecencyTier(item.published_at ?? item.created_at) > 0);
  const fallback = items.filter((item) => getRecencyTier(item.published_at ?? item.created_at) === 0);

  return [...recent, ...fallback].sort((left, right) => {
    const leftTier = getRecencyTier(left.published_at ?? left.created_at);
    const rightTier = getRecencyTier(right.published_at ?? right.created_at);
    if (leftTier !== rightTier) {
      return rightTier - leftTier;
    }

    const leftTime = new Date(left.published_at ?? left.created_at).getTime();
    const rightTime = new Date(right.published_at ?? right.created_at).getTime();
    return rightTime - leftTime;
  });
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

export const getCategoryBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
});

export async function getLatestArticles(limit = 5) {
  const supabase = await createClient();
  return collectRecentArticles(supabase, limit);
}

export async function searchArticles(query: string, limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, article_categories(categories(slug, label))")
    .eq("status", "published")
    .ilike("title", `%${query}%`)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(({ article_categories, ...article }) => ({
    ...article,
    categories: toCategories(article_categories),
  }));
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

  const sorted = sortByRecencyAndViews(
    data.map(({ article_categories, ...article }) => ({
      ...article,
      categories: toCategories(article_categories),
    })),
  );

  return sorted.sort((left, right) => {
    const leftPosition = left.featured_position ?? Number.POSITIVE_INFINITY;
    const rightPosition = right.featured_position ?? Number.POSITIVE_INFINITY;
    if (leftPosition !== rightPosition) {
      return leftPosition - rightPosition;
    }

    return getArticleRecencyScore(right) - getArticleRecencyScore(left);
  });
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
  const items = prioritizeRecentArticles(
    data.map(({ article_categories, ...article }) => ({
      ...article,
      categories: toCategories(article_categories),
    })),
  ).slice(from, to + 1);

  return { items, totalCount: count ?? 0, totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)) };
}

export async function getMostRead(limit = 5) {
  const supabase = await createClient();

  const windows = [24, 48, 72] as const;
  const collected: Array<{ id: string; [key: string]: unknown }> = [];
  const seen = new Set<string>();

  for (const windowHours of windows) {
    const recentSince = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("articles")
      .select("*, article_categories(categories(slug, label))")
      .eq("status", "published")
      .gte("published_at", recentSince)
      .order("published_at", { ascending: false })
      .limit(limit * 5);

    if (error) throw error;

    for (const item of data ?? []) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        collected.push(item);
      }
    }

    if (collected.length >= limit) break;
  }

  if (collected.length < limit) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, article_categories(categories(slug, label))")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit * 5);

    if (error) throw error;

    for (const item of data ?? []) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        collected.push(item);
      }
    }
  }

  const ranked = sortByRecencyAndViews(
    collected.map((article) => ({
      ...(article as ArticleRecord),
      categories: toCategories((article as ArticleRecord).article_categories),
    })),
  );

  return ranked.slice(0, limit);
}

export const getArticleBySlug = cache(async (slug: string) => {
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
});

export async function getAllPublishedSlugs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published");
  if (error) throw error;
  return data;
}

export async function getRelatedArticles(
  title: string,
  excerpt: string,
  content: string,
  categorySlugs: string[],
  excludeId: string,
  limit = 4,
) {
  if (categorySlugs.length === 0) return [];

  const supabase = await createClient();
  const recentSince = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
  const sourceKeywords = extractKeywords(`${title} ${excerpt} ${content}`);

  const baseQuery = supabase
    .from("articles")
    .select("*, article_categories!inner(categories!inner(slug, label))")
    .eq("status", "published")
    .neq("id", excludeId)
    .gte("published_at", recentSince)
    .order("published_at", { ascending: false })
    .limit(limit * 6);

  const { data: categoryMatches, error: categoryError } = await baseQuery.in(
    "article_categories.categories.slug",
    categorySlugs,
  );
  if (categoryError) throw categoryError;

  const rankedCategoryMatches = (categoryMatches ?? [])
    .map(({ article_categories, ...article }) => ({
      ...article,
      categories: toCategories(article_categories),
    }))
    .map((article) => ({
      ...article,
      relatedScore: buildRelatedScore(article as ArticleRecord & { categories: CategoryRef[] }, categorySlugs, sourceKeywords),
    }))
    .sort((left, right) => right.relatedScore - left.relatedScore || getArticleRecencyScore(right) - getArticleRecencyScore(left));

  if (rankedCategoryMatches.length >= limit) {
    return rankedCategoryMatches.slice(0, limit);
  }

  const { data: fallbackData, error: fallbackError } = await baseQuery;
  if (fallbackError) throw fallbackError;

  const rankedFallback = (fallbackData ?? [])
    .map(({ article_categories, ...article }) => ({
      ...article,
      categories: toCategories(article_categories),
    }))
    .map((article) => ({
      ...article,
      relatedScore: buildRelatedScore(article as ArticleRecord & { categories: CategoryRef[] }, categorySlugs, sourceKeywords),
    }))
    .sort((left, right) => right.relatedScore - left.relatedScore || getArticleRecencyScore(right) - getArticleRecencyScore(left));

  return rankedFallback.slice(0, limit);
}
