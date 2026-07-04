import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/article-form";
import { createArticle } from "../actions";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, label")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">مقال جديد</h1>
      <ArticleForm categories={categories ?? []} action={createArticle} />
    </div>
  );
}
