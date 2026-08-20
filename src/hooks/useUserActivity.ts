import { useEffect, useRef } from "react";

import { AppState, AppStateStatus } from "react-native";

import { statsApiService } from "@/services/api/statsApiService";
import { authApiService } from "@/services/api/authApiService";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";

// Controla a primeira execução do hook por inicialização de sessão em memória
let isFirstExecutionInSession = true;

/**
 * Hook para monitorar a atividade do usuário e registrar telemetria.
 * Utiliza um sistema de throttle (30 minutos) para economizar recursos.
 */
export function useUserActivity() {
  const { user, isGuest, lastSeenUpdate, setLastSeenUpdate } = useAuthStore();
  const appState = useRef(AppState.currentState);
  const lastSeenUpdateRef = useRef(lastSeenUpdate);
  lastSeenUpdateRef.current = lastSeenUpdate;

  // Intervalo de 30 minutos em milissegundos
  const THROTTLE_TIME = 30 * 60 * 1000;

  const checkAndUpdateActivity = async () => {
    if (isGuest) {
      statsApiService.logEvent({ eventName: "daily_visit", category: "session", label: "guest" });
      return;
    }

    if (!user) return;
    statsApiService.logEvent({ eventName: "daily_visit", category: "session", label: "user" });
    const now = Date.now();
    const currentLastSeen = lastSeenUpdateRef.current;

    if (isFirstExecutionInSession || !currentLastSeen || now - currentLastSeen > THROTTLE_TIME) {
      isFirstExecutionInSession = false;
      try {
        await authApiService.updateProfile({});
        setLastSeenUpdate(now);
      } catch (error) {
        console.error("[Activity] Erro ao processar atualização de atividade:", error);
      }
    } else {
      const minutesLeft = Math.ceil((THROTTLE_TIME - (now - currentLastSeen)) / 60000);
    }
  };

  useEffect(() => {
    // Primeira verificação ao montar o hook
    checkAndUpdateActivity();

    // Listener para mudanças de estado do app (voltar do background)
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
          console.log("[Activity] App voltou para o primeiro plano.");
          checkAndUpdateActivity();
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [user?.uid, isGuest]);
}
