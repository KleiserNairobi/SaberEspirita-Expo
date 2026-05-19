import { useEffect } from "react";

import { Asset } from "expo-asset";
import Sound from "react-native-sound";

import { usePreferencesStore } from "@/stores/preferencesStore";

let correctSound: Sound | null = null;
let wrongSound: Sound | null = null;
let preloadPromise: Promise<void> | null = null;
let correctLoaded = false;
let wrongLoaded = false;
let lastPlayAtMs = 0;
let playToken = 0;

function buildCandidates(path: string) {
  const candidates: string[] = [];

  if (path) candidates.push(path);

  if (path.startsWith("file://")) {
    candidates.push(path.replace("file://", ""));
  } else if (path.startsWith("/")) {
    candidates.push(`file://${path}`);
  }

  return Array.from(new Set(candidates));
}

function loadSoundWithFallback(candidates: string[]): Promise<Sound | null> {
  return new Promise((resolve) => {
    let index = 0;

    const tryNext = () => {
      const candidate = candidates[index++];
      if (!candidate) {
        resolve(null);
        return;
      }

      let resolved = false;
      const timeout = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        try {
          sound.release();
        } catch {}
        tryNext();
      }, 1800);

      const sound = new Sound(candidate, "", (error) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);

        if (error) {
          try {
            sound.release();
          } catch {}
          tryNext();
          return;
        }

        try {
          sound.setVolume(1.0);
        } catch {}

        resolve(sound);
      });
    };

    tryNext();
  });
}

function preloadQuizSounds(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  if (correctSound && wrongSound && correctLoaded && wrongLoaded) {
    preloadPromise = Promise.resolve();
    return preloadPromise;
  }

  preloadPromise = (async () => {
    try {
      Sound.setCategory("Playback", true);

      const assetCorrect = Asset.fromModule(require("@/assets/sounds/correct.mp3"));
      const assetWrong = Asset.fromModule(require("@/assets/sounds/wrong.mp3"));

      await Promise.all([assetCorrect.downloadAsync(), assetWrong.downloadAsync()]);

      const correctPath = assetCorrect.localUri || assetCorrect.uri;
      const wrongPath = assetWrong.localUri || assetWrong.uri;

      const correctCandidates = buildCandidates(correctPath);
      const wrongCandidates = buildCandidates(wrongPath);

      const [loadedCorrect, loadedWrong] = await Promise.all([
        loadSoundWithFallback(correctCandidates),
        loadSoundWithFallback(wrongCandidates),
      ]);

      correctSound = loadedCorrect;
      wrongSound = loadedWrong;
      correctLoaded = !!loadedCorrect;
      wrongLoaded = !!loadedWrong;
    } catch (err) {
      console.error("[QuizAudio] Erro geral no preload:", err);
    } finally {
      preloadPromise = null;
    }
  })();

  return preloadPromise;
}

export function useQuizAudio() {
  const { soundEffects } = usePreferencesStore();

  useEffect(() => {
    if (!soundEffects) return;

    const timer = setTimeout(() => {
      void preloadQuizSounds();
    }, 500);

    return () => clearTimeout(timer);
  }, [soundEffects]);

  function playFeedback(isCorrect: boolean) {
    if (!soundEffects) return;

    const now = Date.now();
    if (now - lastPlayAtMs < 120) return;
    lastPlayAtMs = now;

    const token = (playToken += 1);

    setTimeout(() => {
      const sound = isCorrect ? correctSound : wrongSound;
      const loaded = isCorrect ? correctLoaded : wrongLoaded;
      if (!sound || !loaded) {
        void preloadQuizSounds().finally(() => {
          if (token !== playToken) return;
          const fallbackSound = isCorrect ? correctSound : wrongSound;
          const fallbackLoaded = isCorrect ? correctLoaded : wrongLoaded;
          if (fallbackSound && fallbackLoaded) {
            safeStopThenPlay(fallbackSound, token);
          } else {
            if (fallbackSound) {
              safeStopThenPlay(fallbackSound, token);
              return;
            }
          }
        });
        return;
      }

      safeStopThenPlay(sound, token);
    }, 0);
  }

  return { playFeedback };
}

function safeStopThenPlay(sound: Sound, token: number) {
  let finished = false;
  let watchdog: ReturnType<typeof setTimeout> | null = null;

  function finalize() {
    if (finished) return;
    finished = true;
    if (watchdog) clearTimeout(watchdog);
    watchdog = null;
  }

  try {
    watchdog = setTimeout(() => {
      if (token !== playToken) return;
      try {
        sound.play((success) => {
          if (!success) console.warn("[QuizAudio] Áudio não decodificado.");
          finalize();
        });
      } catch (err) {
        finalize();
      }
    }, 220);

    sound.stop(() => {
      if (token !== playToken) {
        finalize();
        return;
      }

      try {
        sound.play((success) => {
          if (!success) console.warn("[QuizAudio] Áudio não decodificado.");
          finalize();
        });
      } catch (err) {
        finalize();
      }
    });
  } catch (err) {
    finalize();
  }
}
