import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArticleLink } from "@/components/ads/article-link";
import type { DisplayArticle } from "@/lib/format";

export function CategorySection({
  title,
  href,
  stories,
}: {
  title: string;
  href: string;
  stories: DisplayArticle[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-center justify-between border-b-2 border-primary pb-3">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">{title}</h2>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          المزيد
          <ChevronLeft className="size-4" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stories.map((story) => (
          <ArticleLink key={story.id} href={`/article/${story.slug}`} className="group flex flex-col gap-3">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={story.image}
                alt={story.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
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
      </div>
    </section>
  );
}
