# Security

## Authentication
Briefly uses Supabase Auth for managing users. 
- Sessions are securely managed via HTTP-only cookies in `src/lib/supabase/middleware.ts`.
- Server actions retrieve users via `supabase.auth.getUser()`.

## API Keys
All third-party API keys are strictly kept server-side.
- `NEWS_API_KEY`
- `SCALER_MAX_API_KEY`
- `FISH_AUDIO_API_KEY`

These are never exposed to the client bundle. The Next.js server actions act as a secure proxy.

## Row Level Security (RLS)
The database uses strict RLS policies:
- `profiles`: Select/Update own profile.
- `user_preferences`: Select/Insert/Update own preferences.
- `briefings`: Select/Insert/Update own briefings.
- `stories`: Select own stories. Insert allowed only if linked to user's briefing.
- `saved_stories`: Select/Insert/Delete own saved stories.

## Service Role
The server-side briefing generator uses `SUPABASE_SERVICE_ROLE_KEY` (`supabaseAdmin`) to bypass RLS during pipeline execution. This guarantees that complex background insertions (like bulk stories) don't fail due to unexpected client-side auth context limits, while keeping the client strictly locked out of direct write access to these tables.
