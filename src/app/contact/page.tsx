import type { Metadata } from "next";
import { StaticPageShell } from "@/components/static-page-shell";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع فريق رامية نيوز عبر البريد الإلكتروني.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "اتصل بنا",
    description: "تواصل مع فريق رامية نيوز عبر البريد الإلكتروني.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  return (
    <StaticPageShell title="اتصل بنا">
      <p>
        يسر فريق رامية نيوز استقبال استفساراتكم وآرائكم واقتراحاتكم.
      </p>
      <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 sm:p-5">
        <p className="font-semibold">البريد الإلكتروني:</p>
        <p className="mt-2">📧 ramyanews@gmail.com</p>
      </div>
      <p>
        نسعى للرد على جميع الرسائل في أقرب وقت ممكن.
      </p>
      <p>
        شكراً لثقتكم بـ رامية نيوز.
      </p>
    </StaticPageShell>
  );
}
