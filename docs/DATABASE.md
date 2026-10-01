# Database Schema

## `profiles`
- `id` (uuid, pk, references auth.users)
- `email` (text)
- `name` (text)
- `created_at` (timestamptz)

## `user_preferences`
- `id` (uuid, pk, references auth.users)
- `interests` (text[])
- `briefing_length` (text: quick | standard | deep)
- `audio_speed` (text: 1x | 1.25x | 1.5x | 2x)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## `briefings`
- `id` (uuid, pk)
- `user_id` (uuid, references auth.users)
- `date` (date)
- `status` (text: PENDING | PROCESSING | READY | FAILED)
- `story_count` (integer)
- `duration_seconds` (integer)
- `audio_path` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## `stories`
- `id` (uuid, pk)
- `briefing_id` (uuid, references briefings)
- `source` (text)
- `title` (text)
- `url` (text)
- `published_at` (timestamptz)
- `category` (text)
- `summary` (text)
- `content` (text)
- `entities` (text[])
- `created_at` (timestamptz)

## `saved_stories`
- `id` (uuid, pk)
- `user_id` (uuid, references auth.users)
- `story_id` (uuid, references stories)
- `created_at` (timestamptz)
