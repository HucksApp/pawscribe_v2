import create from 'zustand';
import { persist } from 'zustand/middleware';
import Cache from './cache.js';

export const useFileStore = create(
  persist(
    (set, get) => ({
      files: Cache.getWithExpiry('files') || [],

      setFiles: (files) => {
        Cache.setWithExpiry('files', files, 10800000);
        set({ files });
      },

      addFile: (file) => {
        const updatedFiles = [...get().files, file];
        Cache.setWithExpiry('files', updatedFiles, 10800000);
        set({ files: updatedFiles });
      },

      removeFile: (fileId) => {
        const updatedFiles = get().files.filter((file) => file.id !== fileId);
        Cache.setWithExpiry('files', updatedFiles, 10800000);
        set({ files: updatedFiles });
      },

      updateFile: (updatedFile) => {
        const files = get().files.map((file) =>
          file.id === updatedFile.id ? updatedFile : file
        );
        Cache.setWithExpiry('files', files, 10800000);
        set({ files });
      },
    }),
    {
      name: 'file-store', // Zustand persist key
      getStorage: () => localStorage, // Use localStorage
    }
  )
);
