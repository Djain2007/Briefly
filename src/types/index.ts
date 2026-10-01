export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  interests: string[];
  briefing_length: 'quick' | 'standard' | 'deep';
  audio_speed: string;
  updated_at: string;
}

export interface Briefing {
  id: string;
  user_id: string;
  date: string;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
  story_count: number;
  duration_seconds: number;
  audio_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  briefing_id: string;
  source: string;
  title: string;
  url: string;
  published_at: string;
  category?: string;
  summary: string;
  content?: string;
  entities: string[];
  created_at: string;
}
