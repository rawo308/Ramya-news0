import type { Metadata } from "next";
import { StaticPageShell } from "@/components/static-page-shell";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرف على موقع رامية نيوز ورسالتنا الإخبارية.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "من نحن",
    description: "تعرف على موقع رامية نيوز ورسالتنا الإخبارية.",
    url: "/about",
  },
};

export default async function AboutPage() {
  return (
    <StaticPageShell title="من نحن">
      <p>
        رامية نيوز هو موقع إخباري عربي يهدف إلى نقل الأخبار المحلية والعربية والعالمية بمصداقية
        وسرعة، مع تقديم محتوى متنوع يشمل السياسة، والاقتصاد، 
        والمنوعات.
      </p>
      <p>
        نسعى إلى تقديم أخبار موثوقة ومحدثة باستمرار، مع الالتزام بالمهنية والدقة في نقل
        المعلومات.
      </p>
      <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 sm:p-5">
        <p className="font-semibold">للتواصل معنا:</p>
        <p className="mt-2">📧 ramyanews@gmail.com</p>
      </div>
    </StaticPageShell>
  );
}
