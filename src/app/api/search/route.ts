import { NextResponse } from "next/server";
import { getLatestArticles, searchArticles } from "@/lib/supabase/queries";
import { toDisplayArticle } from "@/lib/format";

export async function GET(req: Request) {
  const query = new URL(req.url).searchParams.get("q")?.trim() ?? "";

  const articles = query ? await searchArticles(query) : await getLatestArticles();

  return NextResponse.json(articles.map(toDisplayArticle));
}
