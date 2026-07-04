import { TickerForm } from "@/components/admin/ticker-form";
import { createTickerItem } from "../actions";

export default function NewTickerItemPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">عنصر جديد في الشريط العاجل</h1>
      <TickerForm action={createTickerItem} />
    </div>
  );
}
