import React, { useState } from "react";

import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Bell, Moon, Sun, UserPlus } from "lucide-react-native";
import { OneSignal } from "react-native-onesignal";

import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { logEvent } from "@/services/analytics/analyticsService";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { NotificationTime } from "@/types/onboarding";

interface OnboardingCompletionPromptModalProps {
  visible: boolean;
  onClose: () => void;
}

export const OnboardingCompletionPromptModal: React.FC<
  OnboardingCompletionPromptModalProps
> = ({ visible, onClose }) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const { isGuest } = useAuthStore();
  const { setOnboardingAnswer } = useOnboardingStore();

  // Etapa interna do modal: 'push' -> 'account' (se guest) -> fechado
  const [modalStage, setModalStage] = useState<"push" | "account">("push");
  const [selectedTime, setSelectedTime] = useState<NotificationTime>("08:00");

  const handleConfirmPush = async () => {
    setOnboardingAnswer("notificationTime", selectedTime);
    logEvent("onboarding_push_accepted", { time: selectedTime });

    try {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        OneSignal.Notifications.requestPermission(true);
      }
    } catch (e) {
      console.warn("Falha ao solicitar permissão OneSignal:", e);
    }

    if (isGuest) {
      setModalStage("account");
    } else {
      onClose();
    }
  };

  const handleDeclinePush = () => {
    logEvent("onboarding_push_declined", {});
    if (isGuest) {
      setModalStage("account");
    } else {
      onClose();
    }
  };

  const handleCreateAccount = () => {
    logEvent("onboarding_guest_register_click", {});
    onClose();
    // Navega para Auth -> Register
    navigation.navigate("Auth", { screen: "Register" });
  };

  const handleDismissAccount = () => {
    logEvent("onboarding_guest_dismiss_register", {});
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          {modalStage === "push" ? (
            <>
              <View style={styles.iconCircle}>
                <Bell size={28} color={theme.colors.primary} />
              </View>

              <Text style={styles.dialogTitle}>Inspiração diária no seu dia</Text>
              <Text style={styles.dialogDescription}>
                Podemos enviar uma gota de sabedoria ou prece para renovar suas forças?
              </Text>

              {/* Seletor de Horário */}
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
                    size={16}
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
                    size={16}
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

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleConfirmPush}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Sim, me lembrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleDeclinePush}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Agora não</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.iconCircle}>
                <UserPlus size={28} color={theme.colors.primary} />
              </View>

              <Text style={styles.dialogTitle}>Deseja salvar seu progresso?</Text>
              <Text style={styles.dialogDescription}>
                Crie uma conta gratuita em segundos para salvar suas leituras, reflexões e
                sincronizar seus estudos em qualquer dispositivo.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCreateAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Criar conta gratuita</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleDismissAccount}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Continuar como visitante</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    dialogCard: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 0, // Flat design
    },
    iconCircle: {
      width: 60,
      height: 60,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    dialogTitle: {
      ...theme.text("lg", "bold", theme.colors.text),
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    dialogDescription: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      textAlign: "center",
      lineHeight: 20,
      marginBottom: theme.spacing.lg,
    },
    timeSelectorContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      width: "100%",
      marginBottom: theme.spacing.lg,
    },
    timeOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    timeOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}12`,
    },
    timeOptionText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    timeOptionTextSelected: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },
    primaryButton: {
      width: "100%",
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
      elevation: 0,
    },
    primaryButtonText: {
      ...theme.text("md", "semibold", theme.colors.onPrimary),
    },
    secondaryButton: {
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
  });
