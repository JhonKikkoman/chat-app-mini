/** @format */

import { create } from 'zustand';

export interface customFileT extends File {}

interface useStoreT {
  file: any;
  showPreview: boolean;
  showEmoji: boolean;
  setFile: (file: customFileT | null) => void;
  setShowPreview: (showPreview: boolean) => void;
  setShowEmoji: (showEmoji: boolean) => void;
}

const useStore = create<useStoreT>((set, get) => ({
  file: null,
  showPreview: false,
  showEmoji: false,
  setFile: (file) => {
    const prevFile = get().file;
    if (prevFile) {
      //https://w3c.github.io/FileAPI/#creating-revoking
      URL.revokeObjectURL(prevFile);
    }
    // обновляем файл
    set({ file });
  },
  // метод обновления индикатора отображения превью
  setShowPreview: (showPreview) => set({ showPreview }),
  // метод для отбражения индикатора эмодзи
  setShowEmoji: (showEmoji) => set({ showEmoji }),
}));

export default useStore;
