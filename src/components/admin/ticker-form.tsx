"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type TickerFormValues = {
  content: string;
  sort_order: number;
  is_active: boolean;
};

export function TickerForm({
  item,
  action,
}: {
  item?: TickerFormValues;
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">النص</Label>
        <Textarea id="content" name="content" rows={2} required defaultValue={item?.content} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sort_order">ترتيب العرض</Label>
        <Input id="sort_order" name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />
      </div>

      <div className="flex items-center gap-2.5">
        <Switch id="is_active" name="is_active" defaultChecked={item?.is_active ?? true} />
        <Label htmlFor="is_active">فعّال (يظهر في الشريط)</Label>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "جارٍ الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
}
