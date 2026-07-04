-- Ramyah News schema
-- Single super-admin model: any authenticated user with profiles.is_admin = true
-- can read/write everything. Public (anon) visitors can only read published content.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- profiles (mirrors auth.users, holds the admin flag)
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, false);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────────────────────
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- articles
-- ─────────────────────────────────────────────────────────────
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  image_url text,
  author text not null default 'فريق التحرير',
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  featured_position int,
  view_count int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_category_id_idx on public.articles (category_id);
create index articles_status_idx on public.articles (status);
create index articles_published_at_idx on public.articles (published_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- site_settings (singleton row — every site-wide text/image/link)
-- ─────────────────────────────────────────────────────────────
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'رامية نيوز',
  tagline text not null default '',
  logo_url text,
  footer_about text not null default '',
  contact_phone text not null default '',
  contact_email text not null default '',
  contact_address text not null default '',
  whatsapp_channel_url text not null default '',
  facebook_url text not null default '',
  instagram_url text not null default '',
  twitter_url text not null default '',
  youtube_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- ticker_items (breaking-news ticker headlines)
-- ─────────────────────────────────────────────────────────────
create table public.ticker_items (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;
alter table public.ticker_items enable row level security;

-- profiles: users can see their own row, admins can see everyone's
create policy "profiles_select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- categories: public read, admin write
create policy "categories_select_public" on public.categories
  for select using (true);
create policy "categories_write_admin" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- articles: public can only see published, admin sees/edits everything
create policy "articles_select_published_or_admin" on public.articles
  for select using (status = 'published' or public.is_admin());
create policy "articles_write_admin" on public.articles
  for all using (public.is_admin()) with check (public.is_admin());

-- site_settings: public read, admin update only (no insert/delete — singleton)
create policy "site_settings_select_public" on public.site_settings
  for select using (true);
create policy "site_settings_update_admin" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- ticker_items: public sees active items, admin sees/edits everything
create policy "ticker_select_active_or_admin" on public.ticker_items
  for select using (is_active = true or public.is_admin());
create policy "ticker_write_admin" on public.ticker_items
  for all using (public.is_admin()) with check (public.is_admin());
