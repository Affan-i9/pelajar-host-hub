-- Fix security definer view issue by using security_invoker
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate view with security_invoker to use the querying user's permissions
CREATE VIEW public.public_profiles 
WITH (security_invoker = true) AS
SELECT 
  id,
  username,
  created_at,
  user_id
FROM public.profiles;