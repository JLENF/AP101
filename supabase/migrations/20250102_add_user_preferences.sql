-- Create user_preferences table
create table if not exists public.user_preferences (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    last_color text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create unique index on user_id
create unique index if not exists user_preferences_user_id_idx on public.user_preferences(user_id);

-- Set up RLS (Row Level Security)
alter table public.user_preferences enable row level security;

-- Create policy to allow users to read their own preferences
create policy "Users can read their own preferences"
    on public.user_preferences
    for select
    using (auth.uid() = user_id);

-- Create policy to allow users to insert their own preferences
create policy "Users can insert their own preferences"
    on public.user_preferences
    for insert
    with check (auth.uid() = user_id);

-- Create policy to allow users to update their own preferences
create policy "Users can update their own preferences"
    on public.user_preferences
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Grant access to authenticated users
grant all on public.user_preferences to authenticated;
