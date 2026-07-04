import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";
import { updateSiteSettings } from "./actions";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  if (!settings) {
    return <p className="text-muted-foreground">تعذر تحميل إعدادات الموقع.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">إعدادات الموقع</h1>
      <SettingsForm settings={settings} action={updateSiteSettings} />
    </div>
  );
}
