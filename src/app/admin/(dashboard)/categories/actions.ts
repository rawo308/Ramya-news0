"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type CategoryFields = {
  slug: string;
  label: string;
  description: string;
  sort_order: number;
};

function readCategoryForm(formData: FormData): CategoryFields {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    label: String(formData.get("label") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createCategory(_prevState: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient();
  const input = readCategoryForm(formData);

  const { error } = await supabase.from("categories").insert(input);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const input = readCategoryForm(formData);

  const { error } = await supabase.from("categories").update(input).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}
