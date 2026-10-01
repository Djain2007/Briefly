# Briefly Architecture

## Overview
Briefly is a monolithic Next.js App Router application designed for generating personalized daily news briefings.

## Key Technologies
- **Next.js 15 (App Router)**: Core framework for UI and API.
- **Supabase**: PostgreSQL database, Auth, and Storage.
- **NewsAPI.ai**: News aggregation and source data.
- **ScalerMax**: Specialized LLM for summarizing content.
- **Fish Audio**: Text-to-Speech generation.
- **Tailwind CSS V4**: Styling and design system.

## Data Flow (Generation Pipeline)
1. **Trigger**: User clicks "Generate Briefing" on the client.
2. **Action**: `generateBriefingAction` is invoked as a server action.
3. **Database Check**: Verifies if a briefing already exists for today.
4. **Fetch**: `NewsProvider` fetches top articles matching user's interests.
5. **Summarize**: `LLMProvider` generates a structured briefing script and array of stories.
6. **TTS**: `TTSProvider` converts the script into an MP3 buffer.
7. **Storage**: MP3 is uploaded to Supabase Storage.
8. **Finalize**: Stories and the briefing metadata are written to Supabase using a Service Role key to bypass RLS.

## Security Posture
- Client-side code never receives API keys.
- RLS policies ensure users can only access their own data.
- The generation pipeline operates server-side with elevated privileges (`supabaseAdmin`) to safely handle database insertions without exposing write privileges to the client.
