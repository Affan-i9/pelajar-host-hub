-- Step 2: Add columns and create functions/policies (now that enum is committed)

-- Add blocked status column to profiles for user blocking feature
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false;

-- Add website_file column to orders for ZIP upload
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS website_file TEXT;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

-- Update orders RLS policies to allow admins to view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.is_super_admin(auth.uid())
);

-- Update profiles policies for super admin access
DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;
CREATE POLICY "Super admins can update any profile"
ON public.profiles
FOR UPDATE
USING (public.is_super_admin(auth.uid()));

-- Allow admins to see all user profiles  
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.profiles;
CREATE POLICY "Admins can view all user profiles"
ON public.profiles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.is_super_admin(auth.uid())
);

-- Grant super admins ability to manage user roles
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.user_roles;
CREATE POLICY "Super admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));