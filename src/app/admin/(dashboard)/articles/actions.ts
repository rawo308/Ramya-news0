"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ArticleStatus } from "@/types/database";

type ArticleFields = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author: string;
  status: ArticleStatus;
  is_featured: boolean;
  featured_position: number | null;
  published_at: string | null;
};

function readArticleForm(formData: FormData): { fields: ArticleFields; categoryIds: string[] } {
  const featuredPosition = String(formData.get("featured_position") ?? "");
  const status = String(formData.get("status") ?? "draft") as "draft" | "published";

  return {
    fields: {
      slug: String(formData.get("slug") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      author: String(formData.get("author") ?? "فريق التحرير").trim(),
      status,
      is_featured: formData.get("is_featured") === "on",
      featured_position: featuredPosition ? Number(featuredPosition) : null,
      published_at: status === "published" ? new Date().toISOString() : null,
    },
    categoryIds: formData.getAll("category_ids").map(String),
  };
}

async function setArticleCategories(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleId: string,
  categoryIds: string[],
) {
  await supabase.from("article_categories").delete().eq("article_id", articleId);
  if (categoryIds.length === 0) return;

  const { error } = await supabase
    .from("article_categories")
    .insert(categoryIds.map((category_id) => ({ article_id: articleId, category_id })));
  if (error) throw error;
}

export async function createArticle(_prevState: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient();
  const { fields, categoryIds } = readArticleForm(formData);

  const { data, error } = await supabase.from("articles").insert(fields).select("id").single();
  if (error) return { error: error.message };

  await setArticleCategories(supabase, data.id, categoryIds);

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const { fields, categoryIds } = readArticleForm(formData);

  const { error } = await supabase.from("articles").update(fields).eq("id", id);
  if (error) return { error: error.message };

  await setArticleCategories(supabase, id, categoryIds);

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/admin/articles");
}
