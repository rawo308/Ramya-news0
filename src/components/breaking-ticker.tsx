import { getTickerItems } from "@/lib/supabase/queries";

export async function BreakingTicker() {
  const tickerItems = await getTickerItems();
  if (!tickerItems || tickerItems.length === 0) return null;

  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="flex items-stretch bg-primary text-primary-foreground">
      <span className="font-heading flex shrink-0 items-center gap-1.5 bg-foreground px-4 py-2 text-sm font-bold">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-primary-foreground" />
        </span>
        عاجل
      </span>
      <div className="relative flex flex-1 items-center overflow-hidden">
        <div className="animate-ticker flex shrink-0 items-center gap-10 py-2 pe-10 text-sm">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item.content}
              <span className="text-primary-foreground/50">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
