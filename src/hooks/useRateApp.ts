import { Alert, Linking, Platform } from "react-native";
import { useCallback } from "react";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/pages/account/constants";

export function useRateApp() {
  const {
    incrementLessonsCompletedCount,
    lessonsCompletedCount,
    rateAppStatus,
    setRateAppStatus,
    updateLastRateInteractionDate,
    lastRateInteractionDate,
  } = usePreferencesStore();

  const checkIfShouldAsk = useCallback(() => {
    const { rateAppStatus, lessonsCompletedCount, lastRateInteractionDate } =
      usePreferencesStore.getState();

    console.log("[useRateApp] Checking if should ask:", {
      rateAppStatus,
      lessonsCompletedCount,
      lastRateInteractionDate,
    });

    // Se já avaliou ou declinou, não pede
    if (rateAppStatus === "rated" || rateAppStatus === "declined") {
      console.log("[useRateApp] User already rated or declined.");
      return false;
    }

    // Regra: Pelo menos 3 lições completadas
    if (lessonsCompletedCount < 3) {
      console.log(`[useRateApp] Not enough lessons (${lessonsCompletedCount}/3).`);
      return false;
    }

    // Regra: Se "idle", pede
    if (rateAppStatus === "idle") {
      console.log("[useRateApp] Status idle, asking now.");
      return true;
    }

    // Regra: Se "remind_later", verificar se passou 7 dias
    if (rateAppStatus === "remind_later" && lastRateInteractionDate) {
      const lastDate = new Date(lastRateInteractionDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const shouldRemind = diffDays >= 7;
      console.log(
        `[useRateApp] Remind later check: ${diffDays} days passed. Should ask: ${shouldRemind}`
      );
      return shouldRemind;
    }

    return false;
  }, []);

  const openStore = async () => {
    const storeUrl = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;

    try {
      const canOpen = await Linking.canOpenURL(storeUrl);

      if (canOpen) {
        await Linking.openURL(storeUrl);
      } else {
        // Fallback
        Alert.alert(
          "Avaliar App",
          Platform.OS === "ios"
            ? "Para avaliar o app, acesse a App Store."
            : "Para avaliar o app, acesse a Play Store."
        );
      }
    } catch (error) {
      console.error("Erro ao abrir loja:", error);
      Alert.alert(
        "Erro",
        "Não foi possível abrir a loja. Por favor, tente novamente mais tarde."
      );
    }
  };

  const handleRateNow = async () => {
    setRateAppStatus("rated");
    updateLastRateInteractionDate();
    await openStore();
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
