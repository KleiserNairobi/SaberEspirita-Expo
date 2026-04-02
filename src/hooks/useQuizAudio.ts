/**
 * useQuizAudio
 *
 * Hook dedicado e isolado para o feedback sonoro do quiz.
 *
 * HISTÓRICO DE PROBLEMAS:
 *
 * v1 — useAudioPlayer(asset) diretamente no componente
 *   → Android: NullPointerException silenciosa quando o asset ainda não estava
 *     carregado, corrompendo o ciclo de render e "travando" as respostas.
 *
 * v2 — useAudioPlayer com carregamento lazy (null → asset após ready)
 *   → mesmo problema; passar null para useAudioPlayer ainda crashava nativamente.
 *
 * v3 — createAudioPlayer (imperativo) + seekTo(0) + play()
 *   → Android: seekTo() é ASSÍNCRONO na camada nativa. O play() chamado
 *     logo em seguida era executado antes da seek completar → som ignorado.
 *     Acontecia principalmente no wrong (primeiro uso) ou logo após o correct.
 *
 * SOLUÇÃO FINAL (v4):
 *   Para sons curtos de feedback, a abordagem mais confiável no Android é
 *   RECRIAR o player a cada reprodução via createAudioPlayer(). Como o arquivo
 *   já está no bundle local (require), a criação é quase instantânea e o player
 *   começa sempre no estado zero — sem seek pendente, sem buffer em transição.
 *   O player anterior é destruído com .remove() para liberar recursos nativos.
 */

import { createAudioPlayer } from "expo-audio";
import { useEffect, useRef } from "react";
import { usePreferencesStore } from "@/stores/preferencesStore";

// Sources resolvidos uma vez (require é estático, não precisa recriar)
const CORRECT_SOURCE = require("@/assets/sounds/correct.mp3");
const WRONG_SOURCE = require("@/assets/sounds/wrong.mp3");

export function useQuizAudio() {
  const { soundEffects } = usePreferencesStore();

  // Guarda a referência do player ativo para garantir o .remove() no cleanup
  const correctPlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const wrongPlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  // Cleanup ao desmontar o componente
  useEffect(() => {
    return () => {
      try { correctPlayerRef.current?.remove(); } catch {}
      try { wrongPlayerRef.current?.remove(); } catch {}
      correctPlayerRef.current = null;
      wrongPlayerRef.current = null;
    };
  }, []);

  /**
   * Toca o som de acerto ou erro.
   *
   * Estratégia: destroy + recreate a cada chamada.
   * - Elimina completamente o problema do seekTo assíncrono no Android.
   * - O arquivo já está no bundle local → createAudioPlayer é quase instantâneo.
   * - Qualquer falha é silenciada — nunca afeta a UI do quiz.
   */
  function playFeedback(isCorrect: boolean) {
    if (!soundEffects) return;

    const ref = isCorrect ? correctPlayerRef : wrongPlayerRef;
    const source = isCorrect ? CORRECT_SOURCE : WRONG_SOURCE;

    try {
      // Destrói o player anterior (libera recursos nativos do Android)
      ref.current?.remove();

      // Cria um novo player — começa sempre do frame zero, sem estado pendente
      const player = createAudioPlayer(source);
      ref.current = player;
      player.play();
    } catch (err) {
      if (__DEV__) console.warn("[useQuizAudio] Falha ao reproduzir som:", err);
    }
  }

  return { playFeedback };
}

