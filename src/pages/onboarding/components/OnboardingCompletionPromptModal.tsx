import React, { forwardRef, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { Moon, Sun } from "lucide-react-native";
import { requestOneSignalPermission } from "@/services/notifications/oneSignalService";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { logEvent } from "@/services/analytics/analyticsService";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { NotificationTime } from "@/types/onboarding";

interface OnboardingCompletionPromptProps {
  onDismiss?: () => void;
}

export const OnboardingCompletionPromptBottomSheet = forwardRef<
  BottomSheetModal,
  OnboardingCompletionPromptProps
>(function OnboardingCompletionPromptBottomSheet({ onDismiss }, ref) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const { isGuest } = useAuthStore();
  const { setOnboardingAnswer, dismissNotificationPrompt } = useOnboardingStore();

  const [modalStage, setModalStage] = useState<"push" | "account">("push");
  const [selectedTime, setSelectedTime] = useState<NotificationTime>("08:00");

  const handleConfirmPush = async () => {
    setOnboardingAnswer("notificationTime", selectedTime);
    logEvent("onboarding_push_accepted", { time: selectedTime });

    if (Platform.OS === "ios" || Platform.OS === "android") {
      await requestOneSignalPermission();
    }

    if (isGuest) {
      setModalStage("account");
    } else {
      (ref as any)?.current?.dismiss();
    }
  };

  const handleDeclinePush = () => {
    logEvent("onboarding_push_declined", {});
    dismissNotificationPrompt();

    if (isGuest) {
      setModalStage("account");
    } else {
      (ref as any)?.current?.dismiss();
    }
  };

  const handleCreateAccount = () => {
    logEvent("onboarding_guest_register_click", {});
    (ref as any)?.current?.dismiss();
    navigation.navigate("Auth", { screen: "Register" });
  };

  const handleDismissAccount = () => {
    logEvent("onboarding_guest_dismiss_register", {});
    (ref as any)?.current?.dismiss();
  };

  const config: BottomSheetMessageConfig =
    modalStage === "push"
      ? {
          type: "info",
          title: "Inspiração diária no seu dia",
          message: "Podemos enviar uma gota de sabedoria ou prece para renovar suas forças?",
          primaryButton: {
            label: "Sim, me lembrar",
            onPress: handleConfirmPush,
          },
          secondaryButton: {
            label: "Agora não",
            onPress: handleDeclinePush,
          },
        }
      : {
          type: "question",
          title: "Deseja salvar seu progresso?",
          message:
            "Crie uma conta gratuita em segundos para salvar suas leituras, reflexões e sincronizar seus estudos em qualquer dispositivo.",
          primaryButton: {
            label: "Criar conta gratuita",
            onPress: handleCreateAccount,
          },
          secondaryButton: {
            label: "Continuar como visitante",
            onPress: handleDismissAccount,
          },
        };

  return (
    <BottomSheetMessage ref={ref} config={config} onDismiss={onDismiss}>
      {modalStage === "push" && (
        <View style={styles.timeSelectorContainer}>
          <TouchableOpacity
            style={[
              styles.timeOption,
              selectedTime === "08:00" && styles.timeOptionSelected,
            ]}
            onPress={() => setSelectedTime("08:00")}
            activeOpacity={0.7}
          >
            <Sun
              size={18}
              color={
                selectedTime === "08:00"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.timeOptionText,
                selectedTime === "08:00" && styles.timeOptionTextSelected,
              ]}
            >
              Manhã (08:00)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.timeOption,
              selectedTime === "20:00" && styles.timeOptionSelected,
            ]}
            onPress={() => setSelectedTime("20:00")}
            activeOpacity={0.7}
          >
            <Moon
              size={18}
              color={
                selectedTime === "20:00"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.timeOptionText,
                selectedTime === "20:00" && styles.timeOptionTextSelected,
              ]}
            >
              Noite (20:00)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </BottomSheetMessage>
  );
});

// Alias para compatibilidade
export const OnboardingCompletionPromptModal = OnboardingCompletionPromptBottomSheet;

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    timeSelectorContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      width: "100%",
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.xs,
    },
    timeOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs + 2,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    timeOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}15`,
    },
    timeOptionText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
    },
    timeOptionTextSelected: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
  });
