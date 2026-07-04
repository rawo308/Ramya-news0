"use client";

import { useState } from "react";
import { Facebook, Link2, Check } from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

export function ShareRow({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://ramyahnews.com${path}`;

  const links = [
    {
      label: "مشاركة عبر واتساب",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: FaWhatsapp,
      hoverClass: "hover:border-[#25D366] hover:text-[#25D366]",
    },
    {
      label: "مشاركة عبر فيسبوك",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: Facebook,
      hoverClass: "hover:border-primary hover:text-primary",
    },
    {
      label: "مشاركة عبر إكس",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: FaXTwitter,
      hoverClass: "hover:border-foreground hover:text-foreground",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors ${link.hoverClass}`}
        >
          <link.icon className="size-4" />
        </a>
      ))}
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="نسخ الرابط"
        className="size-9 rounded-full"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="size-4 text-primary" /> : <Link2 className="size-4" />}
      </Button>
    </div>
  );
}
