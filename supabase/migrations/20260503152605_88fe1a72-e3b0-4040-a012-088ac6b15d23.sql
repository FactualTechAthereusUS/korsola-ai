-- 1) Prevent listing public storage buckets via storage.objects SELECT.
--    Direct public URLs still work because the buckets are marked public.
DROP POLICY IF EXISTS "Allow public read on generated-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read on video-inputs" ON storage.objects;

-- 2) Disallow embedding raw base64 image payloads in spaces_history.content_url.
--    Existing rows are not validated to avoid breaking historical data; new
--    inserts must use a storage URL instead of a data: URI.
ALTER TABLE public.spaces_history
  DROP CONSTRAINT IF EXISTS spaces_history_content_url_no_data_uri;
ALTER TABLE public.spaces_history
  ADD CONSTRAINT spaces_history_content_url_no_data_uri
  CHECK (content_url IS NULL OR content_url !~* '^data:') NOT VALID;