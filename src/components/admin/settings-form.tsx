"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SiteSettingsValues = {
  site_name: string;
  tagline: string;
  logo_url: string | null;
  footer_about: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_channel_url: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
};

export function SettingsForm({
  settings,
  action,
}: {
  settings: SiteSettingsValues;
  action: (
    prevState: { error?: string; ok?: boolean } | undefined,
    formData: FormData,
  ) => Promise<{ error?: string; ok?: boolean } | undefined>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-8">
      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-bold">عام</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="site_name">اسم الموقع</Label>
            <Input id="site_name" name="site_name" required defaultValue={settings.site_name} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tagline">الشعار النصي</Label>
            <Input id="tagline" name="tagline" defaultValue={settings.tagline} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="logo_url">رابط الشعار</Label>
          <Input id="logo_url" name="logo_url" dir="ltr" defaultValue={settings.logo_url ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="footer_about">نبذة (تظهر في تذييل الصفحة)</Label>
          <Textarea id="footer_about" name="footer_about" rows={3} defaultValue={settings.footer_about} />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-bold">التواصل</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_phone">الهاتف</Label>
            <Input id="contact_phone" name="contact_phone" dir="ltr" defaultValue={settings.contact_phone} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_email">البريد الإلكتروني</Label>
            <Input id="contact_email" name="contact_email" dir="ltr" defaultValue={settings.contact_email} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact_address">العنوان</Label>
          <Input id="contact_address" name="contact_address" defaultValue={settings.contact_address} />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-bold">وسائل التواصل الاجتماعي</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="whatsapp_channel_url">قناة واتساب</Label>
            <Input
              id="whatsapp_channel_url"
              name="whatsapp_channel_url"
              dir="ltr"
              defaultValue={settings.whatsapp_channel_url}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="facebook_url">فيسبوك</Label>
            <Input id="facebook_url" name="facebook_url" dir="ltr" defaultValue={settings.facebook_url} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="instagram_url">إنستغرام</Label>
            <Input id="instagram_url" name="instagram_url" dir="ltr" defaultValue={settings.instagram_url} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="twitter_url">إكس (تويتر)</Label>
            <Input id="twitter_url" name="twitter_url" dir="ltr" defaultValue={settings.twitter_url} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="youtube_url">يوتيوب</Label>
            <Input id="youtube_url" name="youtube_url" dir="ltr" defaultValue={settings.youtube_url} />
          </div>
        </div>
      </section>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-primary">تم الحفظ بنجاح</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "جارٍ الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
}
