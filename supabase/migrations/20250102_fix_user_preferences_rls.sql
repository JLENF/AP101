-- Drop existing policies
drop policy if exists "Users can read their own preferences" on public.user_preferences;
drop policy if exists "Users can insert their own preferences" on public.user_preferences;
drop policy if exists "Users can update their own preferences" on public.user_preferences;

-- Recreate policies with simpler conditions
create policy "Enable read access for users"
    on public.user_preferences
    for select
    using (auth.uid() = user_id);

create policy "Enable insert access for users"
    on public.user_preferences
    for insert
    with check (auth.uid() = user_id);

create policy "Enable update access for users"
    on public.user_preferences
    for update
    using (auth.uid() = user_id);

-- Make sure RLS is enabled
alter table public.user_preferences enable row level security;
