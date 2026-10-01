import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import { Story, Briefing } from '@/types';

const supabase = createClient();

export function useTopStories() {
  return useSWR('top_stories', async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    return data as Story[];
  }, { 
    revalidateOnFocus: false,
    dedupingInterval: 300000 // 5 minutes cache
  });
}

export function useForYouStories(interests: string[]) {
  const key = interests && interests.length > 0 ? ['for_you_stories', ...interests] : null;
  
  return useSWR(key, async () => {
    // Filter stories matching any of the interests
    // Supabase JS doesn't have a simple 'in array' for text column matching easily without exact match, 
    // so we'll fetch recent stories and filter client-side, or use an `in` filter.
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .in('category', interests)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) throw error;
    return data as Story[];
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 300000
  });
}

export function useExploreTopics(topic: string) {
  return useSWR(topic ? ['explore_topic', topic] : null, async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .ilike('category', `%${topic}%`)
      .order('created_at', { ascending: false })
      .limit(15);
      
    if (error) throw error;
    return data as Story[];
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 600000 // 10 minutes cache
  });
}

export function useSavedStories(userId: string | undefined) {
  return useSWR(userId ? ['saved_stories', userId] : null, async () => {
    // We need to query saved_stories and join stories
    const { data, error } = await supabase
      .from('saved_stories')
      .select('story_id, stories(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data.map((d: any) => d.stories) as Story[];
  });
}

export function useRecentBriefings(userId: string | undefined) {
  return useSWR(userId ? ['recent_briefings', userId] : null, async () => {
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'READY')
      .order('date', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    return data as Briefing[];
  });
}
