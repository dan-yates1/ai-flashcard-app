export interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FlashcardSet {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  flashcards?: Flashcard[];
  is_public: boolean;
  profiles?: Profile;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  set_id: string;
  front: string;
  back: string;
  media_url?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SharePermission {
  id: string;
  set_id: string;
  email: string;
  permission_level: 'view' | 'edit';
  created_at: string;
  updated_at: string;
}

export interface StudyProgress {
  id: string;
  user_id: string;
  flashcard_id: string;
  last_reviewed: string;
  next_review: string;
  ease_factor: number;
  interval: number;
  created_at: string;
  updated_at: string;
} 