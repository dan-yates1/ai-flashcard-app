import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
} 