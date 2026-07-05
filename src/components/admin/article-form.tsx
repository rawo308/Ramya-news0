"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = { id: string; label: string };

type ArticleFormValues = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_ids: string[];
  image_url: string | null;
  author: string;
  status: "draft" | "published";
  is_featured: boolean;
  featured_position: number | null;
};

export function ArticleForm({
  categories,
  article,
  action,
}: {
  categories: Category[];
  article?: ArticleFormValues;
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [imageUrl, setImageUrl] = useState(article?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل رفع الصورة");
      setImageUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">العنوان</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={article?.title}
            onChange={(e) => {
              if (!article && !slugEdited) {
                setSlug(slugify(e.target.value));
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">الرابط (slug)</Label>
          <Input
            id="slug"
            name="slug"
            required
            dir="ltr"
            placeholder="example-article-slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">الموجز</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">نص المقال</Label>
        <Textarea
          id="content"
          name="content"
          rows={10}
          placeholder="افصل بين الفقرات بسطر فارغ"
          defaultValue={article?.content}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image_url">رابط الصورة</Label>
          <div className="flex gap-2">
            <Input
              id="image_url"
              name="image_url"
              dir="ltr"
              placeholder="https://... أو ارفع صورة"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button type="button" variant="outline" size="icon" disabled={uploading} asChild>
              <label className="cursor-pointer">
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleFileChange}
                />
              </label>
            </Button>
          </div>
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              width={160}
              height={112}
              unoptimized
              className="mt-1 h-28 w-auto rounded-md border object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="author">الكاتب</Label>
          <Input id="author" name="author" defaultValue={article?.author ?? "فريق التحرير"} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>الأقسام (يمكن اختيار أكثر من قسم)</Label>
        <div className="flex flex-wrap gap-x-5 gap-y-2.5 rounded-md border p-3">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <Switch
                name="category_ids"
                value={cat.id}
                defaultChecked={article?.category_ids?.includes(cat.id)}
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">الحالة</Label>
          <Select name="status" defaultValue={article?.status ?? "draft"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="published">منشور</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="featured_position">ترتيب البروز (١-٤، اختياري)</Label>
          <Input
            id="featured_position"
            name="featured_position"
            type="number"
            min={1}
            max={4}
            defaultValue={article?.featured_position ?? ""}
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Switch id="is_featured" name="is_featured" defaultChecked={article?.is_featured} />
        <Label htmlFor="is_featured">إظهار في واجهة الصفحة الرئيسية</Label>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "جارٍ الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
}
