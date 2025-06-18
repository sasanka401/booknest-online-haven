-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create user_roles table
create table if not exists public.user_roles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    role text not null check (role in ('admin', 'user')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create books table
create table if not exists public.books (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    author text not null,
    description text,
    price decimal(10,2) not null,
    image_url text,
    stock integer not null default 0,
    rating decimal(3,2),
    language text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    order_number text not null unique,
    status text not null check (status in ('pending', 'processing', 'completed', 'cancelled')),
    subtotal decimal(10,2) not null,
    shipping decimal(10,2) not null,
    total decimal(10,2) not null,
    payment_method text not null,
    shipping_method text not null,
    shipping_address jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table if not exists public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders not null,
    book_id uuid references public.books not null,
    quantity integer not null,
    price decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create wishlist table
create table if not exists public.wishlist (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    book_id uuid references public.books not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, book_id)
);

-- Enable Row Level Security
alter table public.user_roles enable row level security;
alter table public.books enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist enable row level security;

-- Create policies for user_roles
create policy "Users can read their own role"
    on public.user_roles for select
    using (auth.uid() = user_id);

create policy "Admins can read all roles"
    on public.user_roles for select
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid() and role = 'admin'
        )
    );

-- Create policies for books
create policy "Anyone can read books"
    on public.books for select
    using (true);

create policy "Admins can insert books"
    on public.books for insert
    with check (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid() and role = 'admin'
        )
    );

create policy "Admins can update books"
    on public.books for update
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid() and role = 'admin'
        )
    );

create policy "Admins can delete books"
    on public.books for delete
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid() and role = 'admin'
        )
    );

-- Create policies for orders
create policy "Users can read their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Admins can read all orders"
    on public.orders for select
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid() and role = 'admin'
        )
    );

create policy "Users can create their own orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

-- Create policies for order_items
create policy "Users can read their own order items"
    on public.order_items for select
    using (
        exists (
            select 1 from public.orders
            where id = order_id and user_id = auth.uid()
        )
    );

create policy "Admins can read all order items"
    on public.order_items for select
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid() and role = 'admin'
        )
    );

-- Create policies for wishlist
create policy "Users can read their own wishlist"
    on public.wishlist for select
    using (auth.uid() = user_id);

create policy "Users can manage their own wishlist"
    on public.wishlist for all
    using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_books_updated_at
    before update on public.books
    for each row
    execute function public.handle_updated_at();

create trigger handle_orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at(); 