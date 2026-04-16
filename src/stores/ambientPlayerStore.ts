import { Platform } from "react-native";
import { create } from "zustand";

// Store simples apenas para gerenciar estado
interface AmbientPlayerState {
  isPlaying: boolean;
  currentTrack: string | null;
  currentAudioId: string | null;
  volume: number;
  isDownloading: boolean;
}

interface AmbientPlayerActions {
  setPlaying: (playing: boolean) => void;
  setCurrentTrack: (track: string | null, audioId?: string | null) => void;
  setVolume: (volume: number) => void;
  setDownloading: (isDownloading: boolean) => void;
}

export const useAmbientPlayerStore = create<AmbientPlayerState & AmbientPlayerActions>(
  (set) => ({
    // Estado
    isPlaying: false,
    currentTrack: null,
    currentAudioId: null,
    // No Android o volume tende a ser mais baixo, então iniciamos mais alto (1.0)
    // enquanto no iOS 0.7 já é bem audível.
    volume: Platform.OS === "android" ? 1.0 : 0.7,
    isDownloading: false,

    // Ações
    setPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentTrack: (currentTrack: string | null, currentAudioId?: string | null) =>
      set((state) => ({
        currentTrack,
        currentAudioId:
          currentAudioId !== undefined ? currentAudioId : state.currentAudioId,
      })),
    setVolume: (volume: number) => set({ volume }),
    setDownloading: (isDownloading: boolean) => set({ isDownloading }),
  })
);
