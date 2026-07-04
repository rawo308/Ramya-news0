import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteArticleButton } from "./delete-button";

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  // Selecting `categories(label)` directly off `articles` goes through the
  // article_categories join table (many-to-many), which trips a
  // postgrest-js type-inference bug (collapses to `never`). Selecting the
  // join table explicitly instead is two direct one-hop FK embeds and
  // type-checks fine.
  const { data } = await supabase
    .from("articles")
    .select("id, title, status, is_featured, created_at, article_categories(categories(label))")
    .order("created_at", { ascending: false });
  const articles = data?.map(({ article_categories, ...article }) => ({
    ...article,
    categories: article_categories.map((ac) => ac.categories).filter((c) => c !== null),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">المقالات</h1>
        <Button asChild className="gap-1.5">
          <Link href="/admin/articles/new">
            <Plus className="size-4" />
            مقال جديد
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">العنوان</TableHead>
              <TableHead className="text-start">القسم</TableHead>
              <TableHead className="text-start">الحالة</TableHead>
              <TableHead className="text-start">بارز</TableHead>
              <TableHead className="text-start"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles?.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="max-w-xs truncate font-medium">{article.title}</TableCell>
                <TableCell>
                  {article.categories.length
                    ? article.categories.map((c) => c.label).join("، ")
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={article.status === "published" ? "default" : "secondary"}
                    className={article.status === "published" ? "bg-primary hover:bg-primary" : ""}
                  >
                    {article.status === "published" ? "منشور" : "مسودة"}
                  </Badge>
                </TableCell>
                <TableCell>{article.is_featured ? "نعم" : "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label="تعديل">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteArticleButton id={article.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {articles?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  لا توجد مقالات بعد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
