import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategory } from "../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("slug, label, description, sort_order")
    .eq("id", id)
    .single();

  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">تعديل القسم</h1>
      <CategoryForm category={category} action={updateCategory.bind(null, id)} />
    </div>
  );
}
