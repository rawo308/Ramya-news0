import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteCategoryButton } from "./delete-button";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, label, sort_order")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">الأقسام</h1>
        <Button asChild className="gap-1.5">
          <Link href="/admin/categories/new">
            <Plus className="size-4" />
            قسم جديد
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">الاسم</TableHead>
              <TableHead className="text-start">الرابط</TableHead>
              <TableHead className="text-start">الترتيب</TableHead>
              <TableHead className="text-start"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.label}</TableCell>
                <TableCell dir="ltr" className="text-start text-muted-foreground">
                  /{category.slug}
                </TableCell>
                <TableCell>{category.sort_order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label="تعديل">
                      <Link href={`/admin/categories/${category.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteCategoryButton id={category.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  لا توجد أقسام بعد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
