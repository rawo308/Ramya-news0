"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type TickerItemFields = {
  content: string;
  sort_order: number;
  is_active: boolean;
};

function readTickerForm(formData: FormData): TickerItemFields {
  return {
    content: String(formData.get("content") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createTickerItem(_prevState: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient();
  const input = readTickerForm(formData);

  const { error } = await supabase.from("ticker_items").insert(input);
  if (error) return { error: error.message };

  revalidatePath("/admin/ticker");
  redirect("/admin/ticker");
}

export async function updateTickerItem(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const input = readTickerForm(formData);

  const { error } = await supabase.from("ticker_items").update(input).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/ticker");
  redirect("/admin/ticker");
}

export async function deleteTickerItem(id: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("ticker_items").delete().eq("id", id);
  revalidatePath("/admin/ticker");
}
