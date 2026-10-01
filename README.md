# Briefly

Your day. Your news. One brief.

Briefly is a polished web application that turns the day's important stories into a concise personalized briefing you can read or listen to.

## Local Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   NEWS_API_KEY=your-newsapi-ai-key
   SCALERMAX_BASE_URL=https://api.scalermax.com/v1
   SCALERMAX_API_KEY=your-scalermax-key
   SCALERMAX_MODEL=gpt-4o-mini
   FISH_AUDIO_API_KEY=your-fish-audio-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Integrations Setup

### Supabase (Database & Storage)
1. Create a new project on [Supabase](https://supabase.com).
2. Run the SQL schema found in `supabase/schema.sql` in the SQL Editor.
3. This will create:
   - Tables (`profiles`, `user_preferences`, `briefings`, `stories`)
   - Row Level Security (RLS) policies
   - A trigger for automatic profile creation on user signup
   - A private storage bucket called `briefings` with the correct policies.
4. Obtain the `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from your Project Settings -> API.

### NewsAPI.ai
1. Sign up at [EventRegistry / NewsAPI.ai](https://newsapi.ai/).
2. Get your API key and set `NEWS_API_KEY`.

### ScalerMax
1. Set `SCALERMAX_API_KEY` to your valid ScalerMax (or OpenAI-compatible) key.
2. Ensure `SCALERMAX_BASE_URL` points to the correct endpoint if different from default.
3. Specify your model (e.g., `gpt-4o-mini`).

### Fish Audio
1. Sign up at [Fish Audio](https://fish.audio/).
2. Generate an API key and set `FISH_AUDIO_API_KEY`.

## Vercel Deployment

1. Push your repository to GitHub.
2. Create a new project on Vercel and import the repository.
3. In the Vercel dashboard, configure all environment variables specified in `.env.example`.
4. Deploy.

**Note:** Never commit `.env.local` or any private credentials to your repository.

## Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.
