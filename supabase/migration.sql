-- ============================================
-- Maby — Supabase Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text default '',
  created_at timestamptz default now()
);

-- 2. Couples
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  created_at timestamptz default now()
);

-- 3. Couple members (max 2 per couple)
create table if not exists couple_members (
  user_id uuid primary key references profiles(id) on delete cascade,
  couple_id uuid not null references couples(id) on delete cascade
);

-- 4. Moments
create table if not exists moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  user_id uuid references profiles(id),
  title text not null,
  story text default '',
  image_url text default '',
  date date,
  location text default '',
  song_url text default '',
  created_at timestamptz default now()
);

-- 5. Facts
create table if not exists facts (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  user_id uuid not null references profiles(id),
  category text not null,
  content text not null default '',
  updated_at timestamptz default now()
);

-- Add unique constraint so each user has one fact per category
alter table facts add constraint facts_user_category_unique unique (user_id, category);

-- 6. Wishes
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  user_id uuid references profiles(id),
  text text not null,
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security
-- ============================================

alter table profiles enable row level security;
alter table couples enable row level security;
alter table couple_members enable row level security;
alter table moments enable row level security;
alter table facts enable row level security;
alter table wishes enable row level security;

-- Profiles
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Couple members
create policy "Read own membership" on couple_members for select using (auth.uid() = user_id);
create policy "Insert own membership" on couple_members for insert with check (auth.uid() = user_id);

-- Couples
create policy "Read couple if member" on couples for select
  using (id in (select couple_id from couple_members where user_id = auth.uid()));
create policy "Anyone can create couple" on couples for insert with check (true);
create policy "Anyone can read couple by invite" on couples for select using (true);

-- Moments
create policy "Read couple moments" on moments for select
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));
create policy "Insert couple moments" on moments for insert
  with check (couple_id in (select couple_id from couple_members where user_id = auth.uid()));
create policy "Delete couple moments" on moments for delete
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));

-- Facts
create policy "Read couple facts" on facts for select
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));
create policy "Insert couple facts" on facts for insert
  with check (couple_id in (select couple_id from couple_members where user_id = auth.uid()));
create policy "Update couple facts" on facts for update
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));

-- Wishes
create policy "Read couple wishes" on wishes for select
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));
create policy "Insert couple wishes" on wishes for insert
  with check (couple_id in (select couple_id from couple_members where user_id = auth.uid()));
create policy "Delete couple wishes" on wishes for delete
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));

-- ============================================
-- Auto-create profile on signup (trigger)
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
