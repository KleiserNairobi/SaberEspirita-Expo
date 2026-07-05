import { useEffect, useRef } from "react";

import { AppState, AppStateStatus } from "react-native";

import { StatsService } from "@/services/firebase/statsService";
import { userService } from "@/services/firebase/userService";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";

// Controla a primeira execução do hook por inicialização de sessão em memória
let isFirstExecutionInSession = true;

/**
 * Hook para monitorar a atividade do usuário e atualizar o lastSeenAt no Firestore.
 * Utiliza um sistema de throttle (30 minutos) para economizar recursos do Firebase.
 */
export function useUserActivity() {
  const { user, isGuest, lastSeenUpdate, setLastSeenUpdate } = useAuthStore();
  const appState = useRef(AppState.currentState);

  // Intervalo de 30 minutos em milissegundos
  const THROTTLE_TIME = 30 * 60 * 1000;

  const checkAndUpdateActivity = async () => {
    if (isGuest) {
      await StatsService.logDailyVisit(true);
      return;
    }

    if (!user) return;
    await StatsService.logDailyVisit(false);
    const now = Date.now();

    // Se for a primeira inicialização do app na sessão atual, ignoramos o throttle de 30 minutos
    // para garantir o registro imediato do dispositivo (deviceIds) no Firestore.
    if (isFirstExecutionInSession || !lastSeenUpdate || now - lastSeenUpdate > THROTTLE_TIME) {
      isFirstExecutionInSession = false;
      try {
        await userService.updateLastSeen(user.uid);
        userService.setCourseRemindersPref(
          user.uid,
          usePreferencesStore.getState().courseNotifications
        );
        setLastSeenUpdate(now);
      } catch (error) {
        console.error("[Activity] Erro ao processar atualização de atividade:", error);
      }
    } else {
      const minutesLeft = Math.ceil((THROTTLE_TIME - (now - lastSeenUpdate)) / 60000);
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
  }, [user, isGuest, lastSeenUpdate]);
}
