"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Search, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavCategory = { slug: string; label: string };

export function SiteHeader({
  categories,
  siteName,
  logoUrl,
}: {
  categories: NavCategory[];
  siteName: string;
  logoUrl: string | null;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="hidden items-center justify-between border-b bg-secondary px-4 py-1.5 text-xs text-muted-foreground sm:flex">
        <span>الخميس، ٤ تموز ٢٠٢٦ | بيروت ٢٨°م</span>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-foreground">
            عن الموقع
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            اتصل بنا
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading ps-8 text-start">الأقسام</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2.5 text-start font-heading text-sm hover:bg-accent"
                >
                  الرئيسية
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="rounded-md px-3 py-2.5 text-start font-heading text-sm hover:bg-accent"
                  >
                    {cat.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl || "/logo.jpg"}
              alt={siteName}
              width={44}
              height={44}
              className="rounded-full object-cover"
            />
            <span className="font-heading text-lg font-bold sm:text-xl">
              {siteName}
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {searchOpen ? (
            <Input
              autoFocus
              placeholder="ابحث عن خبر..."
              className="w-56"
              onBlur={() => setSearchOpen(false)}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="بحث"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </Button>
          )}
          <Button className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Radio className="size-4" />
            بث مباشر
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="بحث"
          className="md:hidden"
          onClick={() => setSearchOpen((v) => !v)}
        >
          <Search className="size-5" />
        </Button>
      </div>

      {searchOpen && (
        <div className="px-4 pb-3 md:hidden">
          <Input autoFocus placeholder="ابحث عن خبر..." />
        </div>
      )}

      <nav className="hidden overflow-x-auto border-t px-4 lg:block">
        <ul className="flex items-center gap-1 whitespace-nowrap">
          <li>
            <Link
              href="/"
              className="font-heading inline-block px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:text-primary"
            >
              الرئيسية
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/${cat.slug}`}
                className="font-heading inline-block px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
