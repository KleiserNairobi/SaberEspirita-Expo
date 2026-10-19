import { useReaderPreferencesStore, FontSizeLevel } from "./readerPreferencesStore";

export interface PrayerPreferencesAdapter {
  fontSizeLevel: number;
  setFontSizeLevel: (level: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  getFontSize: () => number;
}

/**
 * Adaptador de compatibilidade para código legado.
 * Redireciona chamadas para a nova useReaderPreferencesStore centralizada.
 */
export function usePrayerPreferencesStore(): PrayerPreferencesAdapter {
  const store = useReaderPreferencesStore();

  return {
    fontSizeLevel: store.fontSizeLevel,
    setFontSizeLevel: (level: number) => {
      store.setFontSizeLevel(Math.max(0, Math.min(3, level)) as FontSizeLevel);
    },
    increaseFontSize: store.increaseFontSize,
    decreaseFontSize: store.decreaseFontSize,
    getFontSize: store.getFontSize,
  };
}

export { useReaderPreferencesStore };
