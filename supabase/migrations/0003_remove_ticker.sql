-- The breaking-news ticker feature has been removed entirely.
alter table public.site_settings drop column if exists ticker_enabled;
drop table if exists public.ticker_items;
