import { create } from "zustand";

type UiState = {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
