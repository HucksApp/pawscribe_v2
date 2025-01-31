import create from 'zustand';
import { persist } from 'zustand/middleware';
import Cache from './cache.js';

export const useFileBlobStore = create(
  persist(
    (set, get) => ({
      fileBlobs: Cache.getWithExpiry('fileBlobs') || [],

      setFileBlobs: (fileBlobs) => {
        Cache.setWithExpiry('fileBlobs', fileBlobs, 10800000);
        set({ fileBlobs });
      },

      addFileBlob: (fileBlob) => {
        const fileBlobs = get().fileBlobs;
        const fileBlobExists = fileBlobs.find(
          (blob) => blob.id === fileBlob.id
        );

        if (!fileBlobExists) {
          const updatedFileBlobs = [...fileBlobs, fileBlob];
          Cache.setWithExpiry('fileBlobs', updatedFileBlobs, 10800000);
          set({ fileBlobs: updatedFileBlobs });
        } else {
          fileBlobExists.blob = fileBlob.blob;
          set({ fileBlobs });
        }
      },

      removeFileBlob: (fileBlobId) => {
        const updatedFileBlobs = get().fileBlobs.filter(
          (blob) => blob.id !== fileBlobId
        );
        Cache.setWithExpiry('fileBlobs', updatedFileBlobs, 10800000);
        set({ fileBlobs: updatedFileBlobs });
      },
    }),
    {
      name: 'fileBlob-store',
      getStorage: () => localStorage,
    }
  )
);
