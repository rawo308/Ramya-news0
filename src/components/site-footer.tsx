import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { idevelopitLink } from "@/lib/ads";

type SiteSettings = {
  site_name: string;
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

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socialLinks = [
    { Icon: Facebook, href: settings.facebook_url },
    { Icon: Instagram, href: settings.instagram_url },
    { Icon: Twitter, href: settings.twitter_url },
    { Icon: Youtube, href: settings.youtube_url },
  ].filter((link) => link.href);

  const footerLinks = [
    { href: "/about", label: "من نحن" },
    { href: "/privacy-policy", label: "سياسة الخصوصية" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={settings.logo_url || "/logo.jpg"}
            alt={settings.site_name}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <span className="font-heading text-lg font-bold">{settings.site_name}</span>
        </Link>
        {settings.footer_about && (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {settings.footer_about}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-foreground/90">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {(settings.whatsapp_channel_url || socialLinks.length > 0) && (
          <div className="flex items-center gap-2">
            {settings.whatsapp_channel_url && (
              <Link
                href={settings.whatsapp_channel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground hover:border-[#25D366] hover:text-[#25D366]"
                aria-label="تابعنا على واتساب"
              >
                <FaWhatsapp className="size-4" />
              </Link>
            )}
            {socialLinks.map(({ Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground hover:border-primary hover:text-primary"
                aria-label="تابعنا على وسائل التواصل"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {settings.site_name}. جميع الحقوق محفوظة.
          </p>
          <Link
            href={idevelopitLink("footer", "credit_link")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>تصميم وتطوير</span>
            <Image
              src="/idevelopit-logo.png"
              alt="iDevelopIt"
              width={18}
              height={18}
              className="rounded-full"
            />
            <span className="font-semibold">iDevelopIt</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
