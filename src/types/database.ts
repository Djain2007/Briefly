export type BriefingStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  interests: string[];
  briefing_length: 'quick' | 'standard' | 'deep';
  created_at: string;
  updated_at: string;
}

export interface Briefing {
  id: string;
  user_id: string;
  date: string;
  status: BriefingStatus;
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
  published_at: string | null;
  category: string | null;
  summary: string;
  content: string | null;
  entities: string[];
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Partial<UserPreferences>;
        Update: Partial<Omit<UserPreferences, 'id' | 'created_at'>>;
      };
      briefings: {
        Row: Briefing;
        Insert: Omit<Briefing, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<Briefing, 'id' | 'created_at' | 'user_id'>>;
      };
      stories: {
        Row: Story;
        Insert: Omit<Story, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Omit<Story, 'id' | 'created_at' | 'briefing_id'>>;
      };
    };
  };
}
