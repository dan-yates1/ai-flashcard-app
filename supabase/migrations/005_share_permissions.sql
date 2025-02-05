create table share_permissions (
  id uuid default uuid_generate_v4() primary key,
  set_id uuid references flashcard_sets(id) on delete cascade,
  email text not null,
  permission_level text check (permission_level in ('view', 'edit')) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index share_permissions_set_id_idx on share_permissions(set_id);
create index share_permissions_email_idx on share_permissions(email); 