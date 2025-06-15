
-- Allow users to SELECT their own role (needed for role checks in Header/Admin dashboard)
CREATE POLICY "Users can read their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
  ));
