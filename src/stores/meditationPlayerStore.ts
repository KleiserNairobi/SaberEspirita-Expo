import { create } from "zustand";
import { IMeditation } from "@/types/meditate";

/**
 * Store de contexto de navegação para o player de meditação.
 *
 * Alimentada pelas telas de listagem (MeditateHome e AllMeditations)
 * antes da navegação, permitindo que o MeditationPlayerScreen acesse
 * o objeto IMeditation imediatamente, sem aguardar o fetch do Firestore.
 *
 * Não é persistida: é contexto de sessão, não estado de longa duração.
 */
interface MeditationPlayerState {
  currentMeditation: IMeditation | null;
}

interface MeditationPlayerActions {
  setCurrentMeditation: (meditation: IMeditation | null) => void;
  clearCurrentMeditation: () => void;
}

export const useMeditationPlayerStore = create<
  MeditationPlayerState & MeditationPlayerActions
>((set) => ({
  currentMeditation: null,
  setCurrentMeditation: (meditation) => set({ currentMeditation: meditation }),
  clearCurrentMeditation: () => set({ currentMeditation: null }),
}));
