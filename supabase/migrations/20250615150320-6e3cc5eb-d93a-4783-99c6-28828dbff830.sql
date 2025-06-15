
-- 1. Drop the problematic policy first (to remove the recursion)
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;

-- 2. Create (or replace) a security definer function to check for admin
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
  );
$$;

-- 3. Add a new policy using the function (no subquery in policy, so no recursion)
CREATE POLICY "Users can read their own roles (no recursion)"
  ON public.user_roles
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.has_admin_role(auth.uid())
  );
