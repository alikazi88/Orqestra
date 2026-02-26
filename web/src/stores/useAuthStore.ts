import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    profile: any | null;
    workspace: any | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: any | null) => void;
    setWorkspace: (workspace: any | null) => void;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    workspace: null,
    loading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setWorkspace: (workspace) => set({ workspace }),
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null, workspace: null });
    },
}));
