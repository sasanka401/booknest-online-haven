
-- 1. User Authentication & Profiles

-- Create the profiles table, referencing auth.users for each user's profile data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT
);

-- 3. Wishlists

CREATE TABLE public.wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id BIGINT REFERENCES public.books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, book_id)
);

-- 4. Order History & Tracking (link orders with users)
ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 5. Admin Dashboard (store roles for users)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 10. Book Reselling (user-to-user marketplace)
CREATE TABLE public.resell_books (
  id BIGSERIAL PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_title TEXT NOT NULL,
  book_author TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  description TEXT,
  condition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Notifications
CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resell_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read policies for demonstration
CREATE POLICY "Anyone can view books" ON public.books FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view their profiles" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can edit their profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Wishlists policies
CREATE POLICY "Users can manage their wishlists" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Order policies (history/tracking)
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies (admins only manage)
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (EXISTS (
  SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
));

-- Resell books policies
CREATE POLICY "Users can sell books" ON public.resell_books FOR ALL USING (auth.uid() = seller_id);

-- Notifications policies
CREATE POLICY "Users can see their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
