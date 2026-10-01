-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Preferences Table
create table public.user_preferences (
  id uuid references auth.users on delete cascade not null primary key,
  interests text[] default '{}'::text[] not null,
  briefing_length text default 'standard' not null,
  audio_speed text default '1x' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Briefings Table
create table public.briefings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  status text not null check (status in ('PENDING', 'PROCESSING', 'READY', 'FAILED')),
  story_count integer default 0 not null,
  duration_seconds integer default 0 not null,
  audio_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stories Table
create table public.stories (
  id uuid default gen_random_uuid() primary key,
  briefing_id uuid references public.briefings on delete cascade not null,
  source text not null,
  title text not null,
  url text not null,
  published_at timestamp with time zone,
  category text,
  summary text not null,
  content text,
  entities text[] default '{}'::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved Stories Table
create table public.saved_stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  story_id uuid references public.stories on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, story_id)
);

-- Setup Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.briefings enable row level security;
alter table public.stories enable row level security;
alter table public.saved_stories enable row level security;

-- Policies for Profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policies for User Preferences
create policy "Users can view their own preferences" on public.user_preferences
  for select using (auth.uid() = id);

create policy "Users can insert their own preferences" on public.user_preferences
  for insert with check (auth.uid() = id);

create policy "Users can update their own preferences" on public.user_preferences
  for update using (auth.uid() = id);

-- Policies for Briefings
create policy "Users can view their own briefings" on public.briefings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own briefings" on public.briefings
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own briefings" on public.briefings
  for update using (auth.uid() = user_id);

-- Policies for Stories
create policy "Users can view stories for their briefings" on public.stories
  for select using (
    exists (
      select 1 from public.briefings
      where briefings.id = stories.briefing_id
      and briefings.user_id = auth.uid()
    )
  );

create policy "Users can insert stories for their briefings" on public.stories
  for insert with check (
    exists (
      select 1 from public.briefings
      where briefings.id = stories.briefing_id
      and briefings.user_id = auth.uid()
    )
  );

-- Policies for Saved Stories
create policy "Users can view their own saved stories" on public.saved_stories
  for select using (auth.uid() = user_id);

create policy "Users can save stories" on public.saved_stories
  for insert with check (auth.uid() = user_id);

create policy "Users can unsave stories" on public.saved_stories
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  
  insert into public.user_preferences (id)
  values (new.id);
  
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create storage bucket for audio briefings
insert into storage.buckets (id, name, public) values ('briefings', 'briefings', false);

-- Storage policies
create policy "Users can access their own audio" on storage.objects
  for select using (
    bucket_id = 'briefings'
    and auth.role() = 'authenticated'
  );

-- Service role has full access to briefings bucket (implicitly true for bypass_rls but good practice)
