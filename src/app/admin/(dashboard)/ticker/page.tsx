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
import { DeleteTickerButton } from "./delete-button";

export default async function AdminTickerPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("ticker_items")
    .select("id, content, sort_order, is_active")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">الشريط العاجل</h1>
        <Button asChild className="gap-1.5">
          <Link href="/admin/ticker/new">
            <Plus className="size-4" />
            عنصر جديد
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">النص</TableHead>
              <TableHead className="text-start">الترتيب</TableHead>
              <TableHead className="text-start">الحالة</TableHead>
              <TableHead className="text-start"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-md truncate">{item.content}</TableCell>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.is_active ? "default" : "secondary"}
                    className={item.is_active ? "bg-primary hover:bg-primary" : ""}
                  >
                    {item.is_active ? "فعّال" : "متوقف"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label="تعديل">
                      <Link href={`/admin/ticker/${item.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteTickerButton id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  لا توجد عناصر بعد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
