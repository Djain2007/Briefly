'use server';

import { createClient } from '@/lib/supabase/server';
import { NewsProvider } from '@/lib/providers/news';
import { LLMProvider } from '@/lib/providers/llm';
import { TTSProvider } from '@/lib/providers/tts';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function generateBriefingAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Use service role for backend operations to bypass RLS
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get user preferences
  const { data: prefs, error: prefsError } = await supabaseAdmin
    .from('user_preferences')
    .select('interests, briefing_length')
    .eq('id', user.id)
    .single();

  if (prefsError || !prefs) {
    return { success: false, error: 'Could not fetch user preferences' };
  }

  const interests = prefs.interests;
  if (!interests || interests.length === 0) {
    return { success: false, error: 'No interests selected. Please select at least one interest.' };
  }

  // Check for existing briefing today
  const today = new Date().toISOString().split('T')[0];
  const { data: existingBriefing } = await supabaseAdmin
    .from('briefings')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('date', today)
    .in('status', ['PENDING', 'PROCESSING', 'READY'])
    .maybeSingle();

  if (existingBriefing) {
    return { success: false, error: 'A briefing is already generated or being processed for today.' };
  }

  // Create a pending briefing record
  const { data: briefing, error: briefingError } = await supabaseAdmin
    .from('briefings')
    .insert({
      user_id: user.id,
      date: today,
      status: 'PROCESSING',
    })
    .select()
    .single();

  if (briefingError || !briefing) {
    console.error('Briefing insert error:', briefingError);
    return { success: false, error: 'Could not create briefing record' };
  }

  try {
    // 1. Fetch news
    const newsProvider = new NewsProvider();
    const articles = await newsProvider.fetchTopNewsByCategories(interests);

    if (articles.length === 0) {
      throw new Error('No news articles found for your interests today.');
    }

    // 2. Generate summary
    const llmProvider = new LLMProvider();
    const result = await llmProvider.generateBriefing(articles, prefs.briefing_length as 'quick' | 'standard' | 'deep');

    // 3. Generate audio
    const ttsProvider = new TTSProvider();
    const audioBuffer = await ttsProvider.generateAudio(result.briefing_script);
    
    // 4. Upload audio to Supabase Storage
    const datePath = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    const audioPath = `${user.id}/${datePath}/${briefing.id}.mp3`;
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('briefings')
      .upload(audioPath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload audio briefing.');
    }

    let storyCount = 0;
    // 5. Save stories
    if (result.stories && result.stories.length > 0) {
      const storiesToInsert = result.stories.map((s: { original_article_id?: string, headline?: string, category?: string, summary?: string, key_points?: string[] }) => {
        const original = articles.find(a => a.id === s.original_article_id) || articles[0] || {};
        return {
          briefing_id: briefing.id,
          source: original.source || 'Unknown',
          title: s.headline || 'News Story',
          url: original.url || '#',
          published_at: original.published_at || new Date().toISOString(),
          category: s.category || 'General',
          summary: s.summary || 'Summary unavailable.',
          entities: Array.isArray(s.key_points) ? s.key_points.map(String) : [],
        };
      });

      storyCount = storiesToInsert.length;

      const { error: storiesError } = await supabaseAdmin
        .from('stories')
        .insert(storiesToInsert);

      if (storiesError) {
        console.error('Stories insert error:', storiesError);
        throw new Error(`Failed to save briefing stories: ${storiesError.message}`);
      }
    }

    // 6. Mark as READY
    await supabaseAdmin
      .from('briefings')
      .update({
        status: 'READY',
        story_count: storyCount,
        duration_seconds: Math.floor(audioBuffer.byteLength / 24000), // very rough estimate
        audio_path: audioPath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefing.id);

    return { success: true, briefingId: briefing.id };
  } catch (error) {
    console.error('Briefing generation failed:', error);
    
    await supabaseAdmin
      .from('briefings')
      .update({
        status: 'FAILED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefing.id);

    return { success: false, error: (error instanceof Error ? error.message : 'An unexpected error occurred during generation.') };
  }
}
