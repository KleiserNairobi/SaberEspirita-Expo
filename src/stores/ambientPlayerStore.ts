import { create } from "zustand";

// Store simples apenas para gerenciar estado
interface AmbientPlayerState {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
}

interface AmbientPlayerActions {
  setPlaying: (playing: boolean) => void;
  setCurrentTrack: (track: string | null) => void;
  setVolume: (volume: number) => void;
}

export const useAmbientPlayerStore = create<AmbientPlayerState & AmbientPlayerActions>(
  (set) => ({
    // Estado
    isPlaying: false,
    currentTrack: null,
    volume: 0.7,

    // Ações
    setPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentTrack: (currentTrack: string | null) => set({ currentTrack }),
    setVolume: (volume: number) => set({ volume }),
  })
);
