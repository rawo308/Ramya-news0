import type { Metadata } from "next";
import { StaticPageShell } from "@/components/static-page-shell";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية الخاصة بموقع رامية نيوز.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "سياسة الخصوصية",
    description: "سياسة الخصوصية الخاصة بموقع رامية نيوز.",
    url: "/privacy-policy",
  },
};

export default async function PrivacyPolicyPage() {
  return (
    <StaticPageShell title="سياسة الخصوصية">
      <p>
        يحرص موقع رامية نيوز على احترام خصوصية زواره وحماية بياناتهم.
      </p>
      <p>
        قد نقوم بجمع بعض المعلومات التقنية مثل عنوان IP، ونوع المتصفح، والصفحات التي تمت
        زيارتها، وذلك بهدف تحسين أداء الموقع وتطوير تجربة المستخدم.
      </p>
      <p>
        قد يستخدم الموقع ملفات تعريف الارتباط (Cookies) لتحسين التصفح، كما قد تعرض خدمات إعلانية
        مثل Google AdSense إعلانات تعتمد على ملفات تعريف الارتباط وفقًا لسياساتها.
      </p>
      <p>
        قد يحتوي الموقع على روابط لمواقع خارجية، ولسنا مسؤولين عن محتوى أو سياسات الخصوصية
        الخاصة بها.
      </p>
      <p>
        باستخدامك موقع رامية نيوز فإنك توافق على سياسة الخصوصية هذه، ويحتفظ الموقع بحق تحديثها
        عند الحاجة.
      </p>
      <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 sm:p-5">
        <p className="font-semibold">للتواصل معنا:</p>
        <p className="mt-2">📧 ramyanews@gmail.com</p>
      </div>
    </StaticPageShell>
  );
}
