-- ============================================================
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query
-- Paste everything below, then click Run.
-- ============================================================

-- Profiles: one row per signed-up user (client or editor)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'client' check (role in ('client', 'editor')),
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Projects: one row per submitted editing project
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete cascade,
  project_type text,
  status text default 'submitted' check (status in ('submitted', 'in_review', 'in_progress', 'delivered')),
  notes text,
  file_path text, -- path within the "drafts" storage bucket, if a file was uploaded
  created_at timestamp with time zone default now()
);

alter table projects enable row level security;

create policy "Clients can view their own projects"
  on projects for select
  using (auth.uid() = client_id);

create policy "Clients can create their own projects"
  on projects for insert
  with check (auth.uid() = client_id);

-- ============================================================
-- File storage for uploaded drafts — ALREADY APPLIED to the live
-- project (as of the file-upload feature being added). Included
-- here so the schema file stays a complete, accurate record of
-- what's live. Re-running this is safe (uses "if not exists" /
-- "on conflict do nothing" where possible) but not necessary.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('drafts', 'drafts', false)
on conflict (id) do nothing;

create policy if not exists "Clients can upload their own drafts"
  on storage.objects for insert
  with check (bucket_id = 'drafts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Clients can view their own drafts"
  on storage.objects for select
  using (bucket_id = 'drafts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Clients can delete their own drafts"
  on storage.objects for delete
  using (bucket_id = 'drafts' and auth.uid()::text = (storage.foldername(name))[1]);
