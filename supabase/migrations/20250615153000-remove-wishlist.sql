-- Remove wishlist policies
DROP POLICY IF EXISTS "Users can manage their wishlists" ON public.wishlists;

-- Remove wishlist table
DROP TABLE IF EXISTS public.wishlists; 