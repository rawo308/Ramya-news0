import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { LebanonSection } from "@/components/lebanon-section";
import { CategorySection } from "@/components/category-section";
import { WhatsappBand } from "@/components/whatsapp-band";
import { SiteFooter } from "@/components/site-footer";
import { NativeAdBar } from "@/components/ads/native-ad-bar";
import { getCategories, getCategoryArticles, getSiteSettings } from "@/lib/supabase/queries";
import { toDisplayArticle } from "@/lib/format";

export default async function Home() {
  const [categories, settings, { items: sportsArticles }] = await Promise.all([
    getCategories(),
    getSiteSettings(),
    getCategoryArticles("sports", 1, 4),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader categories={categories} siteName={settings.site_name} logoUrl={settings.logo_url} />
      <main className="flex-1">
        <HeroSection />
        <LebanonSection />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <NativeAdBar />
        </div>
        {sportsArticles.length > 0 && (
          <div className="border-t bg-secondary/20">
            <CategorySection
              title="رياضة"
              href="/sports"
              stories={sportsArticles.map(toDisplayArticle)}
            />
          </div>
        )}
        <WhatsappBand channelUrl={settings.whatsapp_channel_url} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
