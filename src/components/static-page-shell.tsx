import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SponsorBanner } from "@/components/ads/sponsor-banner";
import { getCategories, getSiteSettings } from "@/lib/supabase/queries";

export async function StaticPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader categories={categories} siteName={settings.site_name} logoUrl={settings.logo_url} />
      <SponsorBanner />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <div className="rounded-2xl border border-border/70 bg-background/95 p-6 shadow-sm sm:p-8 lg:p-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowRight className="size-4 rotate-180" />
              العودة إلى الرئيسية
            </Link>

            <h1 className="mt-6 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
              {title}
            </h1>

            <div className="mt-6 space-y-5 text-base leading-8 text-foreground/90">
              {children}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
