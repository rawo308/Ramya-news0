import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { MostRead } from "@/components/most-read";
import { CategorySection } from "@/components/category-section";
import { ShareRow } from "@/components/share-row";
import { WhatsappBand } from "@/components/whatsapp-band";
import { SiteFooter } from "@/components/site-footer";
import { SponsorBanner } from "@/components/ads/sponsor-banner";
import {
  getArticleBySlug,
  getCategories,
  getRelatedArticles,
  getSiteSettings,
} from "@/lib/supabase/queries";
import { formatRelativeTime, toDisplayArticle } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const description = article.excerpt || undefined;
  const images = article.image_url ? [article.image_url] : undefined;
  const path = `/article/${article.slug}`;

  return {
    title: article.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description,
      images,
      publishedTime: article.published_at ?? article.created_at,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article, categories, settings] = await Promise.all([
    getArticleBySlug(slug),
    getCategories(),
    getSiteSettings(),
  ]);
  if (!article) notFound();

  const related = await getRelatedArticles(
    article.categories.map((c) => c.slug),
    article.id,
  );

  const primaryCategory = article.categories[0];
  const paragraphs = article.content.split(/\n\n+/).filter(Boolean);
  const wordCount = article.content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 150));
  const readTimeLabel =
    readMinutes === 1
      ? "دقيقة واحدة للقراءة"
      : readMinutes === 2
        ? "دقيقتان للقراءة"
        : `${readMinutes} دقائق للقراءة`;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader categories={categories} siteName={settings.site_name} logoUrl={settings.logo_url} />
      <SponsorBanner />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              الرئيسية
            </Link>
            <ChevronLeft className="size-3.5" />
            {primaryCategory ? (
              <Link href={`/${primaryCategory.slug}`} className="hover:text-primary">
                {primaryCategory.label}
              </Link>
            ) : (
              <span>عام</span>
            )}
          </div>

          <Badge className="mb-3 bg-primary text-primary-foreground hover:bg-primary">
            {primaryCategory?.label ?? "عام"}
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold leading-snug sm:text-3xl sm:leading-snug">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y py-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-foreground">{article.author}</span>
              <span className="text-muted-foreground">
                {formatRelativeTime(article.published_at ?? article.created_at)}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3.5" />
                {readTimeLabel}
              </span>
            </div>
            <ShareRow title={article.title} path={`/article/${article.slug}`} />
          </div>
        </div>

        {article.image_url && (
          <div className="mx-auto max-w-5xl px-4 pb-8">
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-6xl px-4 pb-10">
          <div className="grid gap-10 lg:grid-cols-3">
            <article className="max-w-3xl space-y-5 lg:col-span-2">
              {paragraphs.map((paragraph, i) => (
                <Fragment key={i}>
                  <p className="text-base leading-loose text-foreground/90">
                    {paragraph.split("\n").map((line, j) => (
                      <Fragment key={j}>
                        {j > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                </Fragment>
              ))}
            </article>

            <MostRead />
          </div>
        </div>

        {related.length > 0 && (
          <div className="border-t bg-secondary/20">
            <CategorySection
              title="مواضيع ذات صلة"
              href={primaryCategory ? `/${primaryCategory.slug}` : "/"}
              stories={related.map(toDisplayArticle)}
            />
          </div>
        )}

        <WhatsappBand channelUrl={settings.whatsapp_channel_url} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
