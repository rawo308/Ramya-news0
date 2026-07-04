"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">العنوان</Label>
          <Input id="title" name="title" required defaultValue={article?.title} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">الرابط (slug)</Label>
          <Input
            id="slug"
            name="slug"
            required
            dir="ltr"
            placeholder="example-article-slug"
            defaultValue={article?.slug}
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
          <Input
            id="image_url"
            name="image_url"
            dir="ltr"
            placeholder="https://res.cloudinary.com/..."
            defaultValue={article?.image_url ?? ""}
          />
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
