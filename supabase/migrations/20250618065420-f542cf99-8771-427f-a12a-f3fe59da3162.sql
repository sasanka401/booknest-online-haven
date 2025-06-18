
-- Create user-specific cart table
CREATE TABLE public.user_carts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id BIGINT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable RLS for user_carts
ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;

-- Create policies for user_carts
CREATE POLICY "Users can manage their own cart items" 
  ON public.user_carts 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Update wishlists table to have proper RLS policies
CREATE POLICY "Users can manage their own wishlist items" 
  ON public.wishlists 
  FOR ALL 
  USING (auth.uid() = user_id);
