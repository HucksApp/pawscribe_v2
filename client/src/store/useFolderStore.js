import create from 'zustand';
import { persist } from 'zustand/middleware';
import Cache from './cache.js';

export const useFolderStore = create(
  persist(
    (set, get) => ({
      folders: Cache.getWithExpiry('folders') || [],

      setFolders: (folders) => {
        Cache.setWithExpiry('folders', folders, 10800000);
        set({ folders });
      },

      addFolder: (folder) => {
        const updatedFolders = [...get().folders, folder];
        Cache.setWithExpiry('folders', updatedFolders, 10800000);
        set({ folders: updatedFolders });
      },

      removeFolder: (folderId) => {
        const updatedFolders = get().folders.filter(
          (folder) => folder.id !== folderId
        );
        Cache.setWithExpiry('folders', updatedFolders, 10800000);
        set({ folders: updatedFolders });
      },

      updateFolder: (updatedFolder) => {
        const folders = get().folders.map((folder) =>
          folder.id === updatedFolder.id ? updatedFolder : folder
        );
        Cache.setWithExpiry('folders', folders, 10800000);
        set({ folders });
      },
    }),
    {
      name: 'folder-store',
      getStorage: () => localStorage,
    }
  )
);
