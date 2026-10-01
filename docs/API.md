# Internal APIs

The application uses Next.js Server Actions instead of traditional API routes. 

## `src/lib/actions/briefing.ts`
- `generateBriefingAction()`: Initiates the entire pipeline. Fetches news, summarizes with LLM, converts to TTS, stores to DB/Storage. Handles idempotency (checks if briefing already exists for today).

## `src/lib/actions/auth.ts`
- `login(formData)`
- `register(formData)`
- `logout()`

## `src/lib/actions/stories.ts`
- `saveStory(storyId)`: Adds a story to `saved_stories`.
- `unsaveStory(storyId)`: Removes a story from `saved_stories`.

# External APIs

## NewsAPI.ai (EventRegistry)
- Endpoint: `https://eventregistry.org/api/v1/article/getArticles`
- Usage: Fetches top articles based on user keywords.

## ScalerMax (via OpenAI SDK)
- Endpoint: `https://api.scaler.com/v1`
- Model: `scaler-max`
- Usage: Analyzes articles, extracts key entities, and formats a cohesive briefing script.

## Fish Audio
- Endpoint: `https://api.fish.audio/v1/tts`
- Model: `s2.1-pro-free`
- Usage: Converts the LLM-generated briefing script into a high-quality streaming MP3 buffer. Uses a specific model to avoid billing errors on the free tier.
