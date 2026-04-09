import { create } from "zustand";

// Store simples apenas para gerenciar estado
interface AmbientPlayerState {
  isPlaying: boolean;
  currentTrack: string | null;
  currentAudioId: string | null;
  volume: number;
}

interface AmbientPlayerActions {
  setPlaying: (playing: boolean) => void;
  setCurrentTrack: (track: string | null, audioId?: string | null) => void;
  setVolume: (volume: number) => void;
}

export const useAmbientPlayerStore = create<AmbientPlayerState & AmbientPlayerActions>(
  (set) => ({
    // Estado
    isPlaying: false,
    currentTrack: null,
    currentAudioId: null,
    volume: 0.7,

    // Ações
    setPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentTrack: (currentTrack: string | null, currentAudioId: string | null = null) => 
      set((state) => ({ 
        currentTrack, 
        currentAudioId: currentAudioId !== null ? currentAudioId : state.currentAudioId 
      })),
    setVolume: (volume: number) => set({ volume }),
  })
);
