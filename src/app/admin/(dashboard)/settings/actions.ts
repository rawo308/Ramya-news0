"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteSettings(_prevState: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  const supabase = await createClient();

  const input = {
    site_name: String(formData.get("site_name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    logo_url: String(formData.get("logo_url") ?? "").trim() || null,
    footer_about: String(formData.get("footer_about") ?? "").trim(),
    contact_phone: String(formData.get("contact_phone") ?? "").trim(),
    contact_email: String(formData.get("contact_email") ?? "").trim(),
    contact_address: String(formData.get("contact_address") ?? "").trim(),
    whatsapp_channel_url: String(formData.get("whatsapp_channel_url") ?? "").trim(),
    facebook_url: String(formData.get("facebook_url") ?? "").trim(),
    instagram_url: String(formData.get("instagram_url") ?? "").trim(),
    twitter_url: String(formData.get("twitter_url") ?? "").trim(),
    youtube_url: String(formData.get("youtube_url") ?? "").trim(),
  };

  const { error } = await supabase.from("site_settings").update(input).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}
