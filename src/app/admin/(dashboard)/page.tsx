import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ count: published }, { count: drafts }, { count: categories }] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "مقالات منشورة", value: published ?? 0 },
    { label: "مسودات", value: drafts ?? 0 },
    { label: "الأقسام", value: categories ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">لوحة التحكم</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-background p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-heading mt-1 text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
