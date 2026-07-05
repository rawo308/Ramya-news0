import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllPublishedSlugs, getCategories } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([getAllPublishedSlugs(), getCategories()]);

  const homeEntry: MetadataRoute.Sitemap = [{ url: SITE_URL, changeFrequency: "hourly", priority: 1 }];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/${category.slug}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/article/${article.slug}`,
    lastModified: article.updated_at,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...homeEntry, ...categoryEntries, ...articleEntries];
}
