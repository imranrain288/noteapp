'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SupabaseContextType = {
  auth: any;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  signIn: async () => { },
  signUp: async () => { },
  signOut: async () => { },
  signInWithGoogle: async () => { },
  auth: undefined
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      // Use requestAnimationFrame to ensure state updates are complete
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          router.refresh();
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/');
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) {
        if (error.message.includes('provider is not enabled')) {
          console.error('Google authentication is not enabled in Supabase project settings');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        auth: supabase.auth,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
