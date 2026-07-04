"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryFormValues = {
  slug: string;
  label: string;
  description: string;
  sort_order: number;
};

export function CategoryForm({
  category,
  action,
}: {
  category?: CategoryFormValues;
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="label">الاسم</Label>
          <Input id="label" name="label" required defaultValue={category?.label} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">الرابط (slug)</Label>
          <Input
            id="slug"
            name="slug"
            required
            dir="ltr"
            placeholder="example-category"
            defaultValue={category?.slug}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" rows={2} defaultValue={category?.description} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sort_order">ترتيب العرض</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={category?.sort_order ?? 0}
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "جارٍ الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
}
