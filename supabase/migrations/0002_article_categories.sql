-- Articles used to belong to a single category (articles.category_id).
-- This migrates to a many-to-many model so one article can appear on
-- multiple category pages.

-- ─────────────────────────────────────────────────────────────
-- article_categories (many-to-many: articles <-> categories)
-- ─────────────────────────────────────────────────────────────
create table public.article_categories (
  article_id uuid not null references public.articles (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (article_id, category_id)
);

create index article_categories_category_id_idx on public.article_categories (category_id);

-- Backfill from the existing single-category column before dropping it.
insert into public.article_categories (article_id, category_id)
select id, category_id from public.articles where category_id is not null;

alter table public.articles drop column category_id;

alter table public.article_categories enable row level security;

-- article_categories: visible if the linked article is visible, admin writes
create policy "article_categories_select_public" on public.article_categories
  for select using (
    exists (
      select 1 from public.articles a
      where a.id = article_id and (a.status = 'published' or public.is_admin())
    )
  );
create policy "article_categories_write_admin" on public.article_categories
  for all using (public.is_admin()) with check (public.is_admin());
