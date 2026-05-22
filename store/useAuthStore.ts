import { create } from 'zustand';
import { api } from '@/lib/api';
import { setAccessToken } from '@/lib/authToken';
import { useStore } from './useStore';

export interface AuthUser {
    id: number;
    email: string;
    displayName: string | null;
    role: 'CUSTOMER' | 'ADMIN';
    photoURL: string | null;
}

interface AuthResponse {
    user: AuthUser;
    accessToken: string;
}

interface AuthState {
    user: AuthUser | null;
    status: 'loading' | 'authenticated' | 'guest';
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    loadSession: () => Promise<void>;
    setUser: (user: AuthUser) => void;
    refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    status: 'loading',

    login: async (email, password) => {
        const data = await api.post<AuthResponse>('/auth/login', { email, password });
        setAccessToken(data.accessToken);
        set({ user: data.user, status: 'authenticated' });
        await useStore.getState().syncGuestStateToServer();
    },

    register: async (email, password, displayName) => {
        const data = await api.post<AuthResponse>('/auth/register', { email, password, displayName });
        setAccessToken(data.accessToken);
        set({ user: data.user, status: 'authenticated' });
        await useStore.getState().syncGuestStateToServer();
    },

    logout: async () => {
        try {
            await api.post('/auth/logout', undefined, true);
        } catch {
            /* ignore network errors on logout */
        }
        setAccessToken(null);
        useStore.getState().resetLocalState();
        set({ user: null, status: 'guest' });
    },

    setUser: (user) => set({ user }),

    // Re-fetch the current user from GET /auth/me.
    refreshUser: async () => {
        try {
            const data = await api.get<{ user: AuthUser }>('/auth/me', true);
            set({ user: data.user });
        } catch {
            /* ignore */
        }
    },

    // Called once on app mount: restore the session from the refresh cookie.
    loadSession: async () => {
        try {
            const data = await api.post<AuthResponse>('/auth/refresh');
            setAccessToken(data.accessToken);
            set({ user: data.user, status: 'authenticated' });
            await useStore.getState().hydrateFromServer();
        } catch {
            setAccessToken(null);
            set({ user: null, status: 'guest' });
        }
    },
}));
