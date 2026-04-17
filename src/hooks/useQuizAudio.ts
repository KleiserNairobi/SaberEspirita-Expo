import Sound from "react-native-sound";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { Asset } from "expo-asset";

// Habilitar mix com outros áudios para não travar a meditação
Sound.setCategory("Playback", true);

let correctSound: Sound | null = null;
let wrongSound: Sound | null = null;
let isPreloading = false;

/**
 * Pré-carrega os sons do Quiz usando expo-asset.
 * Removemos o "file://" manualmente para o iOS não confundir o basePath.
 */
async function preloadQuizSounds() {
  if (isPreloading || (correctSound && wrongSound)) return;
  isPreloading = true;

  try {
    const assetCorrect = Asset.fromModule(require("@/assets/sounds/correct.mp3"));
    const assetWrong = Asset.fromModule(require("@/assets/sounds/wrong.mp3"));

    await Promise.all([assetCorrect.downloadAsync(), assetWrong.downloadAsync()]);

    let correctPath = assetCorrect.localUri || assetCorrect.uri;
    let wrongPath = assetWrong.localUri || assetWrong.uri;

    // A MÁGICA PRO iOS: Se a URI começar com file://, cortamos. 
    // O react-native-sound exige um path limpo iniciado com / no iOS.
    if (correctPath.startsWith('file://')) correctPath = correctPath.replace('file://', '');
    if (wrongPath.startsWith('file://')) wrongPath = wrongPath.replace('file://', '');

    // Passamos vazio '' no basePath para que o player saiba que é um caminho absoluto
    correctSound = new Sound(correctPath, '', (error) => {
      if (error) console.warn("[QuizAudio] Erro ao carregar acerto:", error);
    });

    wrongSound = new Sound(wrongPath, '', (error) => {
      if (error) console.warn("[QuizAudio] Erro ao carregar erro:", error);
    });
  } catch (err) {
    console.error("[QuizAudio] Erro geral no preload:", err);
  } finally {
    isPreloading = false;
  }
}

// Inicia o carregamento assim que o hook é importado
preloadQuizSounds();

export function useQuizAudio() {
  const { soundEffects } = usePreferencesStore();

  async function playFeedback(isCorrect: boolean) {
    if (!soundEffects) return;

    let sound = isCorrect ? correctSound : wrongSound;

    // Fallback de segurança se o preload não for concluído ou falhar
    if (!sound) {
      await preloadQuizSounds();
      sound = isCorrect ? correctSound : wrongSound;
    }

    if (sound) {
      // Para se já estiver tocando e reinicia imediatamente
      sound.stop(() => {
        sound?.play((success) => {
          if (!success) {
            console.warn("[QuizAudio] O iOS cortou o áudio ou arquivo não decodificado.");
          }
        });
      });
    }
  }

  return { playFeedback };
}
