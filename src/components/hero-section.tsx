import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getFeaturedArticles } from "@/lib/supabase/queries";
import { toDisplayArticle } from "@/lib/format";

export async function HeroSection() {
  const articles = await getFeaturedArticles();
  if (!articles || articles.length === 0) return null;

  const [lead, ...rest] = articles.map(toDisplayArticle);
  const secondaryStories = rest.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <Link
          href={`/article/${lead.slug}`}
          className="group relative flex flex-col overflow-hidden rounded-xl lg:col-span-2"
        >
          <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-7">
              <Badge className="w-fit bg-primary text-primary-foreground hover:bg-primary">
                {lead.category}
              </Badge>
              <h1 className="font-heading text-xl font-bold leading-snug text-white sm:text-3xl">
                {lead.title}
              </h1>
              <p className="hidden max-w-2xl text-sm leading-relaxed text-white/80 sm:block">
                {lead.excerpt}
              </p>
              <span className="text-xs text-white/60">{lead.time}</span>
            </div>
          </div>
        </Link>

        <div className="flex flex-col divide-y divide-border">
          {secondaryStories.map((story) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="group flex items-start gap-3 py-4 first:pt-0"
            >
              <div className="relative aspect-4/3 w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:w-32">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-primary">
                  {story.category}
                </span>
                <h3 className="font-heading text-sm font-bold leading-snug group-hover:text-primary sm:text-base">
                  {story.title}
                </h3>
                <span className="text-xs text-muted-foreground">{story.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
