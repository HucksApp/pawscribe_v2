import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import Cache from './cache.js';

export const useUserStore = create(
  persist(
    (set) => ({
      user: Cache.getWithExpiry('user') || null,

      setUser: (user) => {
        Cache.setWithExpiry('user', user, 10800000);
        set({ user });
      },

      clearUser: () => {
        Cache.clearAllWithPrefix('all');
        set({ user: null });
      },
    }),
    {
      name: 'user-store',
      getStorage: () => localStorage,
    }
  )
);
