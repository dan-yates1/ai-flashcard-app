import { supabase } from './supabase';
import type { Profile, FlashcardSet, Flashcard, SharePermission, StudyProgress } from '@/types/database';

export const database = {
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    upsert: async (profile: Partial<Profile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  },
  
  flashcardSets: {
    list: async (userId: string) => {
      console.log('Listing sets for user:', userId);
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Found sets:', data);
      return data as FlashcardSet[];
    },
    
    create: async (set: Partial<FlashcardSet>) => {
      console.log('Creating set:', set);
      const { data, error } = await supabase
        .from('flashcard_sets')
        .insert(set)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Created set:', data);
      return data as FlashcardSet;
    },
    
    get: async (id: string) => {
      console.log('Getting set:', id);
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select(`
          *,
          flashcards (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      console.log('Got set with flashcards:', data);
      return data as FlashcardSet & { flashcards: Flashcard[] };
    },
    
    delete: async (setId: string) => {
      const { error } = await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', setId);
      
      if (error) throw error;
    },
    
    update: async (id: string, updates: Partial<FlashcardSet>) => {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as FlashcardSet;
    },

    listPublic: async () => {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*, profiles!inner(*)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as (FlashcardSet & { profiles: Profile })[];
    },
  },
  
  flashcards: {
    create: async (flashcard: Partial<Flashcard>) => {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          ...flashcard,
          sort_order: flashcard.sort_order || 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Flashcard;
    },
    
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Flashcard;
    },
    
    update: async (id: string, updates: Partial<Flashcard>) => {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Flashcard;
    },
    
    delete: async (id: string) => {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },
  
  sharePermissions: {
    list: async (setId: string) => {
      const { data, error } = await supabase
        .from('share_permissions')
        .select('*')
        .eq('set_id', setId);
      
      if (error) throw error;
      return data as SharePermission[];
    },
    
    create: async (permission: Partial<SharePermission>) => {
      const { data, error } = await supabase
        .from('share_permissions')
        .insert(permission)
        .select()
        .single();
      
      if (error) throw error;
      return data as SharePermission;
    },
    
    delete: async (id: string) => {
      const { error } = await supabase
        .from('share_permissions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },
  
  studyProgress: {
    get: async (userId: string, flashcardId: string) => {
      const { data, error } = await supabase
        .from('study_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('flashcard_id', flashcardId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as StudyProgress | null;
    },

    update: async (userId: string, flashcardId: string, rating: 1 | 2 | 3 | 4) => {
      const progress = await database.studyProgress.get(userId, flashcardId);
      const now = new Date();
      
      // SuperMemo 2 Algorithm
      const calculateNextInterval = (
        oldEaseFactor: number,
        oldInterval: number,
        rating: number
      ) => {
        let interval: number;
        let easeFactor = oldEaseFactor;

        if (rating < 3) {
          interval = 1;
        } else if (oldInterval === 0) {
          interval = 1;
        } else if (oldInterval === 1) {
          interval = 6;
        } else {
          interval = Math.round(oldInterval * easeFactor);
        }

        // Adjust ease factor
        easeFactor = oldEaseFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;

        return { interval, easeFactor };
      };

      const { interval, easeFactor } = calculateNextInterval(
        progress?.ease_factor ?? 2.5,
        progress?.interval ?? 0,
        rating
      );

      const nextReview = new Date(now);
      nextReview.setDate(nextReview.getDate() + interval);

      const { data, error } = await supabase
        .from('study_progress')
        .upsert({
          user_id: userId,
          flashcard_id: flashcardId,
          last_reviewed: now.toISOString(),
          next_review: nextReview.toISOString(),
          ease_factor: easeFactor,
          interval,
          updated_at: now.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as StudyProgress;
    },

    getDueCards: async (userId: string, setId: string) => {
      const { data, error } = await supabase
        .from('flashcards')
        .select(`
          *,
          study_progress!inner (*)
        `)
        .eq('set_id', setId)
        .eq('study_progress.user_id', userId)
        .lte('study_progress.next_review', new Date().toISOString());

      if (error) throw error;
      return data as (Flashcard & { study_progress: StudyProgress })[];
    }
  }
}; 