
-- Books table
CREATE TABLE public.books (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT,
  rating NUMERIC
);

-- Orders table
CREATE TABLE public.orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Processing',
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  shipping_method TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping NUMERIC NOT NULL,
  total NUMERIC NOT NULL
);

-- Order items table (for books within each order)
CREATE TABLE public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
  book_id BIGINT REFERENCES public.books(id),
  quantity INT NOT NULL,
  price NUMERIC NOT NULL
);

-- Optional: Enable Row Level Security and allow anyone to read (for demo)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for all users" ON public.books FOR SELECT USING (true);
CREATE POLICY "Allow select for all users" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow select for all users" ON public.order_items FOR SELECT USING (true);
