import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useMoodStore } from "@/stores/moodStore";

/**
 * Hook para monitorar o ciclo de vida do aplicativo (background -> active)
 * e garantir que transições de dia civil renovem o estado emocional/reflexivo.
 */
export function useMoodLifecycle() {
  const checkDayTransition = useMoodStore((state) => state.checkDayTransition);

  useEffect(() => {
    // Verificação imediata ao montar
    checkDayTransition();

    // Listener para quando o app volta do background
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          checkDayTransition();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [checkDayTransition]);
}

