import { Linking, Platform } from "react-native";
import { useCallback } from "react";

import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/utils/constants";

export function useRateApp(options?: {
  showMessage?: (config: BottomSheetMessageConfig) => void;
}) {
  const { showMessage } = options ?? {};
  const {
    incrementLessonsCompletedCount,
    setRateAppStatus,
    updateLastRateInteractionDate,
  } = usePreferencesStore();

  const checkIfShouldAsk = useCallback(() => {
    const { rateAppStatus, lessonsCompletedCount, lastRateInteractionDate } =
      usePreferencesStore.getState();

    if (rateAppStatus === "rated" || rateAppStatus === "declined") {
      return false;
    }

    if (lessonsCompletedCount < 3) {
      return false;
    }

    if (rateAppStatus === "idle") {
      return true;
    }

    if (rateAppStatus === "remind_later" && lastRateInteractionDate) {
      const lastDate = new Date(lastRateInteractionDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays >= 7;
    }

    return false;
  }, []);

  const openStore = async () => {
    const storeUrl = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;

    try {
      const canOpen = await Linking.canOpenURL(storeUrl);

      if (canOpen) {
        await Linking.openURL(storeUrl);
        return true;
      }

      showMessage?.({
        type: "info",
        title: "Avaliar App",
        message:
          Platform.OS === "ios"
            ? "Para avaliar o app, acesse a App Store."
            : "Para avaliar o app, acesse a Play Store.",
        primaryButton: {
          label: "OK",
          onPress: () => {},
        },
      });
      return false;
    } catch (error) {
      console.error("Erro ao abrir loja:", error);
      showMessage?.({
        type: "error",
        title: "Erro",
        message: "Não foi possível abrir a loja. Por favor, tente novamente mais tarde.",
        primaryButton: {
          label: "OK",
          onPress: () => {},
        },
      });
      return false;
    }
  };

  const handleRateNow = async () => {
    const didOpen = await openStore();

    setRateAppStatus(didOpen ? "rated" : "remind_later");
    updateLastRateInteractionDate();
  };

  const handleRemindLater = () => {
    setRateAppStatus("remind_later");
    updateLastRateInteractionDate();
  };

  const handleDecline = () => {
    // Se o usuário não quer avaliar, podemos marcar como 'declined' para não pedir mais,
    // ou tratar como 'remind_later' com um prazo maior. Vamos usar 'declined' para respeitar.
    setRateAppStatus("declined");
    updateLastRateInteractionDate();
  };

  return {
    checkIfShouldAsk,
    handleRateNow,
    handleRemindLater,
    handleDecline,
    incrementLessonsCompletedCount,
    openStore, // Exposto para uso manual se necessário
  };
}
