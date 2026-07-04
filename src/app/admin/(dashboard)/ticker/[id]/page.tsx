import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TickerForm } from "@/components/admin/ticker-form";
import { updateTickerItem } from "../actions";

export default async function EditTickerItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("ticker_items")
    .select("content, sort_order, is_active")
    .eq("id", id)
    .single();

  if (!item) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">تعديل عنصر الشريط العاجل</h1>
      <TickerForm item={item} action={updateTickerItem.bind(null, id)} />
    </div>
  );
}
