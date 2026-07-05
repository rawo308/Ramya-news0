import Link from "next/link";
import { redirect } from "next/navigation";
import { Newspaper, Tags, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { Button } from "@/components/ui/button";
import { signOut } from "../login/actions";

const navItems = [
  { label: "المقالات", href: "/admin/articles", icon: Newspaper },
  { label: "الأقسام", href: "/admin/categories", icon: Tags },
  { label: "إعدادات الموقع", href: "/admin/settings", icon: Settings },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-heading text-xl font-bold">لم يتم إعداد Supabase بعد</h1>
          <p className="mt-2 text-muted-foreground">
            أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY إلى ملف
            .env.local ثم أعد تشغيل الخادم.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-heading text-xl font-bold">غير مصرح</h1>
          <p className="mt-2 text-muted-foreground">
            هذا الحساب غير مخوّل بالدخول إلى لوحة التحكم.
          </p>
          <form action={signOut} className="mt-4">
            <Button type="submit" variant="outline">
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-e bg-secondary/30 p-4 sm:flex">
        <Link href="/admin" className="font-heading mb-6 px-2 text-lg font-bold">
          رامية نيوز
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="mt-auto">
          <Button type="submit" variant="ghost" className="w-full justify-start gap-2">
            <LogOut className="size-4" />
            تسجيل الخروج
          </Button>
        </form>
      </aside>

      <main className="flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
