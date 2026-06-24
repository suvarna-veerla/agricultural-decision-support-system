import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType { user: User | null; loading: boolean; signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>; signIn: (email: string, password: string) => Promise<void>; signOut: () => Promise<void>; }
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchUserProfile(session.user.id); else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchUserProfile(session.user.id); else { setUser(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(uid: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    if (data) setUser({ id: data.id, email: data.email, full_name: data.full_name, phone: data.phone, location: data.location, language: data.language || 'te', role: data.role || 'farmer', created_at: data.created_at });
    setLoading(false);
  }

  const signUp = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password }); if (error) throw error;
    const authUser = data.user;
    if (authUser) { const { error: e } = await supabase.from('profiles').insert({ id: authUser.id, email, full_name: fullName, phone, language: 'te', role: 'farmer' }); if (e) console.error('Profile insert error:', e); }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
  }, []);

  const signOut = useCallback(async () => { await supabase.auth.signOut(); setUser(null); }, []);

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx;
}
