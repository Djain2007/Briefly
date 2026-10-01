'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveStory(storyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('saved_stories')
    .insert({
      user_id: user.id,
      story_id: storyId
    });

  if (error) {
    console.error('Error saving story:', error);
    return { success: false, error: 'Failed to save story' };
  }

  revalidatePath('/app');
  return { success: true };
}

export async function unsaveStory(storyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('saved_stories')
    .delete()
    .eq('user_id', user.id)
    .eq('story_id', storyId);

  if (error) {
    console.error('Error unsaving story:', error);
    return { success: false, error: 'Failed to unsave story' };
  }

  revalidatePath('/app');
  return { success: true };
}
