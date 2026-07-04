-- Public storage bucket for admin-uploaded article images, served via
-- Supabase's built-in CDN instead of a separate provider.
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "article_images_select_public" on storage.objects
  for select using (bucket_id = 'article-images');

create policy "article_images_write_admin" on storage.objects
  for insert with check (bucket_id = 'article-images' and public.is_admin());

create policy "article_images_update_admin" on storage.objects
  for update using (bucket_id = 'article-images' and public.is_admin());

create policy "article_images_delete_admin" on storage.objects
  for delete using (bucket_id = 'article-images' and public.is_admin());
