create extension if not exists pgcrypto;

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists apps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  icon_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_versions (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references apps(id) on delete cascade,
  version_name text not null,
  changelog text not null default '',
  file_url text not null,
  file_key text,
  file_size bigint not null,
  download_password_hash text,
  created_at timestamptz not null default now()
);

alter table app_versions
  add column if not exists download_password_hash text;

create index if not exists app_versions_app_id_created_at_idx
  on app_versions (app_id, created_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists apps_set_updated_at on apps;
create trigger apps_set_updated_at
before update on apps
for each row execute procedure set_updated_at();
