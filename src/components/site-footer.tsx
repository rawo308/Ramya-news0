import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const aboutLinks = [
  { label: "من نحن", href: "/about" },
  { label: "فريق التحرير", href: "/team" },
  { label: "اتصل بنا", href: "/contact" },
  { label: "سياسة الخصوصية", href: "/privacy" },
];

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

export function SiteFooter({
  categories,
  settings,
}: {
  categories: { slug: string; label: string }[];
  settings: SiteSettings;
}) {
  const socialLinks = [
    { Icon: Facebook, href: settings.facebook_url },
    { Icon: Instagram, href: settings.instagram_url },
    { Icon: Twitter, href: settings.twitter_url },
    { Icon: Youtube, href: settings.youtube_url },
  ].filter((link) => link.href);

  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={settings.logo_url || "/logo.jpg"}
              alt={settings.site_name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-heading text-lg font-bold">{settings.site_name}</span>
          </Link>
          {settings.footer_about && (
            <p className="text-sm leading-relaxed text-muted-foreground">{settings.footer_about}</p>
          )}
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
        </div>

        <div>
          <h3 className="font-heading mb-3 text-sm font-bold">الأقسام</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/${cat.slug}`} className="hover:text-primary">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading mb-3 text-sm font-bold">عن الموقع</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {aboutLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading mb-3 text-sm font-bold">تواصل معنا</h3>
          {settings.contact_address && (
            <p className="text-sm text-muted-foreground">{settings.contact_address}</p>
          )}
          {settings.contact_phone && (
            <p className="text-sm text-muted-foreground" dir="ltr">
              {settings.contact_phone}
            </p>
          )}
          {settings.contact_email && (
            <p className="text-sm text-muted-foreground" dir="ltr">
              {settings.contact_email}
            </p>
          )}
        </div>
      </div>

      <div className="border-t py-4">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {settings.site_name}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
