import { create } from "zustand";
import { SubcategoryFilterType } from "@/pages/fix/subcategories/components/SubcategoryFilterBottomSheet";

interface QuizFilterState {
  filters: Record<string, SubcategoryFilterType>; // categoryId -> filterType
  setFilter: (categoryId: string, filter: SubcategoryFilterType) => void;
  getFilter: (categoryId: string) => SubcategoryFilterType;
}

export const useQuizFilterStore = create<QuizFilterState>((set, get) => ({
  filters: {},
  setFilter: (categoryId, filter) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [categoryId]: filter,
      },
    })),
  getFilter: (categoryId) => get().filters[categoryId] || "ALL",
}));
