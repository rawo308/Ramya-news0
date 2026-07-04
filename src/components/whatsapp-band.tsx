import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function WhatsappBand({ channelUrl }: { channelUrl: string }) {
  if (!channelUrl) return null;

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-start">
        <div className="flex items-center gap-3">
          <FaWhatsapp className="size-9 shrink-0 text-[#25D366]" />
          <div>
            <h2 className="font-heading text-lg font-bold sm:text-xl">
              تابعنا على واتساب
            </h2>
            <p className="text-sm text-background/70">
              انضم إلى قناتنا على واتساب ليصلك العاجل أول بأول
            </p>
          </div>
        </div>
        <Button
          asChild
          className="shrink-0 gap-2 bg-[#25D366] text-white hover:bg-[#25D366]/90"
        >
          <a href={channelUrl} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="size-4" />
            انضم الآن
          </a>
        </Button>
      </div>
    </section>
  );
}
