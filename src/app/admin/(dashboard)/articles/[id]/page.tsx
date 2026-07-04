import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/article-form";
import { updateArticle } from "../actions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: article }, { data: categories }, { data: articleCategories }] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, label").order("sort_order"),
    supabase.from("article_categories").select("category_id").eq("article_id", id),
  ]);

  if (!article) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">تعديل المقال</h1>
      <ArticleForm
        categories={categories ?? []}
        article={{ ...article, category_ids: (articleCategories ?? []).map((c) => c.category_id) }}
        action={updateArticle.bind(null, id)}
      />
    </div>
  );
}
