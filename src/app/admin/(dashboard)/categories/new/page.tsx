import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">قسم جديد</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
