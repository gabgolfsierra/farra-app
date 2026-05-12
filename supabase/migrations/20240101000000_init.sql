-- Users (espelho do auth.users do Supabase)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Venues (locais/casas)
create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text not null,
  city text not null,
  state text not null,
  lat numeric(10,7) not null,
  lng numeric(10,7) not null,
  cover_url text,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- Events
create table public.events (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  ticket_url text,
  cover_url text,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- Attendance (confirmações de presença)
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.venues enable row level security;
alter table public.events enable row level security;
alter table public.attendance enable row level security;

-- Policies básicas
create policy "Usuário vê próprio perfil"
  on public.users for select
  using (auth.uid() = id);

create policy "Eventos publicados são públicos"
  on public.events for select
  using (is_published = true);

create policy "Venues são públicos"
  on public.venues for select
  using (true);

create policy "Usuário vê própria presença"
  on public.attendance for select
  using (auth.uid() = user_id);

create policy "Usuário confirma própria presença"
  on public.attendance for insert
  with check (auth.uid() = user_id);

create policy "Usuário cancela própria presença"
  on public.attendance for delete
  using (auth.uid() = user_id);