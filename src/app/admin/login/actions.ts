"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export async function signIn(_prevState: { error?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "لم يتم إعداد Supabase بعد. أضف مفاتيح المشروع إلى .env.local" };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
