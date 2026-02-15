-- Supabase SQL schema for AchAqui
-- Run in Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Users profile table (linked to auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique,
  phone text unique,
  role text not null default 'client',
  avatar_url text,
  bio text,
  location jsonb,
  provider_info jsonb,
  rating_average numeric default 0,
  rating_count integer default 0,
  is_verified boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  provider_id uuid not null references public.users(id) on delete cascade,
  price_value numeric,
  price_currency text default 'AOA',
  availability jsonb,
  images text[] default '{}',
  rating_average numeric default 0,
  rating_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ratings table
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  provider_id uuid not null references public.users(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 5),
  title text,
  comment text,
  aspects jsonb,
  images text[] default '{}',
  provider_reply jsonb,
  is_verified_purchase boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists users_role_idx on public.users(role);
create index if not exists users_city_idx on public.users ((location->>'city'));
create index if not exists services_category_idx on public.services(category);
create index if not exists services_provider_idx on public.services(provider_id);
create index if not exists ratings_service_idx on public.ratings(service_id);
create index if not exists ratings_provider_idx on public.ratings(provider_id);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.services enable row level security;
alter table public.ratings enable row level security;

-- Policies: open read, restricted write (adjust as needed)
create policy if not exists "Public read users" on public.users
  for select using (true);

create policy if not exists "Public read services" on public.services
  for select using (true);

create policy if not exists "Public read ratings" on public.ratings
  for select using (true);

create policy if not exists "User can update own profile" on public.users
  for update using (auth.uid() = id);

create policy if not exists "Provider can manage own services" on public.services
  for all using (auth.uid() = provider_id);

create policy if not exists "User can create rating" on public.ratings
  for insert with check (auth.uid() = user_id);
