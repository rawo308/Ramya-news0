"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-5 rounded-xl border bg-background p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo.jpg"
            alt="رامية نيوز"
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
          <h1 className="font-heading text-lg font-bold">لوحة تحكم رامية نيوز</h1>
          <p className="text-sm text-muted-foreground">تسجيل دخول المسؤول</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" dir="ltr" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            dir="ltr"
          />
        </div>

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "جارٍ الدخول..." : "دخول"}
        </Button>
      </form>
    </div>
  );
}
