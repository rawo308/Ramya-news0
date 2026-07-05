import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { MostRead } from "@/components/most-read";
import { SiteFooter } from "@/components/site-footer";
import { PaginationNav } from "@/components/pagination-nav";
import { AdBanner } from "@/components/ads/ad-banner";
import { SponsorBanner } from "@/components/ads/sponsor-banner";
import { ArticleLink } from "@/components/ads/article-link";
import {
  getCategories,
  getCategoryArticles,
  getCategoryBySlug,
  getSiteSettings,
} from "@/lib/supabase/queries";
import { toDisplayArticle } from "@/lib/format";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [category, categories, settings] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategories(),
    getSiteSettings(),
  ]);
  if (!category) notFound();

  const { items, totalPages } = await getCategoryArticles(categorySlug, page);
  const stories = items.map(toDisplayArticle);
  const featured = page === 1 ? stories[0] : null;
  const gridItems = page === 1 ? stories.slice(1) : stories;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader categories={categories} siteName={settings.site_name} logoUrl={settings.logo_url} />
      <SponsorBanner />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              الرئيسية
            </Link>
            <ChevronLeft className="size-3.5" />
            <span className="text-foreground">{category.label}</span>
          </div>
          <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">{category.label}</h1>
          {category.description && (
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">{category.description}</p>
          )}
        </div>

        {featured && (
          <div className="mx-auto max-w-6xl px-4 pb-8">
            <ArticleLink
              href={`/article/${featured.slug}`}
              className="group relative flex overflow-hidden rounded-xl"
            >
              <div className="relative aspect-21/9 w-full overflow-hidden bg-muted">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 1152px) 1152px, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-7">
                  <Badge className="w-fit bg-primary text-primary-foreground hover:bg-primary">
                    {featured.category}
                  </Badge>
                  <h2 className="font-heading text-xl font-bold leading-snug text-white sm:text-2xl">
                    {featured.title}
                  </h2>
                  <span className="text-xs text-white/60">{featured.time}</span>
                </div>
              </div>
            </ArticleLink>
          </div>
        )}

        <AdBanner className="border-y bg-secondary/10 py-2" />

        <div className="mx-auto max-w-6xl px-4 pb-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
              {gridItems.map((story, i) => (
                <ArticleLink
                  key={story.id}
                  href={`/article/${story.slug}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      priority={!featured && i === 0}
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute start-3 top-3 bg-primary text-primary-foreground hover:bg-primary">
                      {story.category}
                    </Badge>
                  </div>
                  <h3 className="font-heading text-sm font-bold leading-snug group-hover:text-primary sm:text-base">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {story.excerpt}
                    </p>
                  )}
                  <span className="text-xs text-muted-foreground">{story.time}</span>
                </ArticleLink>
              ))}
              {stories.length === 0 && (
                <p className="col-span-full py-8 text-center text-muted-foreground">
                  لا توجد مقالات في هذا القسم بعد
                </p>
              )}
            </div>

            <MostRead />
          </div>
        </div>

        <PaginationNav basePath={`/${categorySlug}`} page={page} totalPages={totalPages} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
