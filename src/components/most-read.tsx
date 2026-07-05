import { TrendingUp } from "lucide-react";
import { ArticleLink } from "@/components/ads/article-link";
import { getMostRead } from "@/lib/supabase/queries";
import { toDisplayArticle } from "@/lib/format";

export async function MostRead() {
  const articles = await getMostRead();
  if (!articles || articles.length === 0) return null;

  const stories = articles.map(toDisplayArticle);

  return (
    <aside className="rounded-xl border bg-secondary/40 p-5">
      <div className="mb-4 flex items-center gap-2 border-b-2 border-primary pb-3">
        <TrendingUp className="size-5 text-primary" />
        <h2 className="font-heading text-lg font-bold">الأكثر قراءة</h2>
      </div>
      <ol className="flex flex-col divide-y divide-border">
        {stories.map((story, i) => (
          <li key={story.id}>
            <ArticleLink
              href={`/article/${story.slug}`}
              className="group flex items-start gap-3 py-3.5 first:pt-0"
            >
              <span className="font-heading text-2xl font-extrabold text-primary/30 group-hover:text-primary/60">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-primary">
                  {story.category}
                </span>
                <h3 className="font-heading text-sm font-bold leading-snug group-hover:text-primary">
                  {story.title}
                </h3>
                <span className="text-xs text-muted-foreground">{story.time}</span>
              </div>
            </ArticleLink>
          </li>
        ))}
      </ol>
    </aside>
  );
}
