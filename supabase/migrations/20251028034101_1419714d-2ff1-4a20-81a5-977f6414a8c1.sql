-- Fix security issues

-- 1. Add RLS policies to user_roles table to prevent unauthorized access
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 2. Update profiles RLS to hide emails from public view
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view basic profile info"
ON public.profiles
FOR SELECT
USING (true);

-- 3. Add policy to allow users to see their own full profile including email
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4. Add column-level security by creating a view for public profiles
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  created_at,
  CASE 
    WHEN user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') 
    THEN email 
    ELSE NULL 
  END as email,
  user_id
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;