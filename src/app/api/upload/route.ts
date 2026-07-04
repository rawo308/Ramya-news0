import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const BUCKET = "article-images";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "صيغة الصورة غير مدعومة" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "حجم الصورة أكبر من 5 ميغابايت" }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
    contentType: file.type,
  });
  if (error) {
    console.error("Supabase storage upload failed:", error);
    return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return NextResponse.json({ url: data.publicUrl });
}
