import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MostRead } from "@/components/most-read";
import { getCategoryArticles } from "@/lib/supabase/queries";
import { toDisplayArticle } from "@/lib/format";

export async function LebanonSection() {
  const { items } = await getCategoryArticles("lebanon", 1, 4);
  if (items.length === 0) return null;

  const stories = items.map(toDisplayArticle);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between border-b-2 border-primary pb-3">
            <h2 className="font-heading text-xl font-bold sm:text-2xl">لبنان</h2>
            <Link
              href="/lebanon"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              المزيد
              <ChevronLeft className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/article/${story.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
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
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {story.excerpt}
                </p>
                <span className="text-xs text-muted-foreground">{story.time}</span>
              </Link>
            ))}
          </div>
        </div>

        <MostRead />
      </div>
    </section>
  );
}
