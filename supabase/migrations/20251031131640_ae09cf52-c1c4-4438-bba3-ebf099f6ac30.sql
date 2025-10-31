-- Storage policies for private bucket 'payment-proofs'
-- Ensure per-user folder access and admin read access

-- 1) Allow authenticated users to upload to their own folder in payment-proofs
DROP POLICY IF EXISTS "Users can upload own payment proofs" ON storage.objects;
CREATE POLICY "Users can upload own payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2) Allow authenticated users to read files in their own folder
DROP POLICY IF EXISTS "Users can read own payment proofs" ON storage.objects;
CREATE POLICY "Users can read own payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3) Allow admins to read any payment proofs (for verification)
DROP POLICY IF EXISTS "Admins can read payment proofs" ON storage.objects;
CREATE POLICY "Admins can read payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND public.has_role(auth.uid(), 'admin')
);
