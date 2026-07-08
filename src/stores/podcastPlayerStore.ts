import { create } from "zustand";
import { IPodcast } from "@/types/podcast";

/**
 * Store de contexto de navegação para o player de podcast.
 *
 * Alimentada pelas telas de listagem (AllPodcastsScreen)
 * antes da navegação, permitindo que o PodcastPlayerScreen acesse
 * o objeto IPodcast imediatamente, sem aguardar o fetch do Firestore.
 *
 * Não é persistida: é contexto de sessão, não estado de longa duração.
 */
interface PodcastPlayerState {
  currentPodcast: IPodcast | null;
}

interface PodcastPlayerActions {
  setCurrentPodcast: (podcast: IPodcast | null) => void;
  clearCurrentPodcast: () => void;
}

export const usePodcastPlayerStore = create<
  PodcastPlayerState & PodcastPlayerActions
>((set) => ({
  currentPodcast: null,
  setCurrentPodcast: (podcast) => set({ currentPodcast: podcast }),
  clearCurrentPodcast: () => set({ currentPodcast: null }),
}));
