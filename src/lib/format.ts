export type DisplayArticle = {
  id: string;
  slug: string;
  category: string;
  categorySlug: string | null;
  title: string;
  excerpt: string;
  image: string;
  time: string;
};

const FALLBACK_IMAGE = "https://picsum.photos/seed/ramyah-fallback/600/450";

export function formatRelativeTime(iso: string | null): string {
  if (!iso) return "";
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} ${minutes <= 2 ? (minutes === 1 ? "دقيقة" : "دقيقتين") : "دقائق"}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ${hours <= 2 ? (hours === 1 ? "ساعة" : "ساعتين") : "ساعات"}`;

  const days = Math.floor(hours / 24);
  return `منذ ${days} ${days <= 2 ? (days === 1 ? "يوم" : "يومين") : "أيام"}`;
}

export function toDisplayArticle(article: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  categories: { slug: string; label: string }[];
}): DisplayArticle {
  const primary = article.categories[0];
  return {
    id: article.id,
    slug: article.slug,
    category: primary?.label ?? "عام",
    categorySlug: primary?.slug ?? null,
    title: article.title,
    excerpt: article.excerpt,
    image: article.image_url || FALLBACK_IMAGE,
    time: formatRelativeTime(article.published_at ?? article.created_at),
  };
}
