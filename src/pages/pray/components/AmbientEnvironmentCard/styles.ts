import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      aspectRatio: 16 / 9,
    },
    loadingContainer: {
      aspectRatio: 16 / 9,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 20,
    },
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    overlay: {
      flex: 1,
      padding: 24,
      justifyContent: "space-between",
      backgroundColor: "rgba(0,0,0,0.1)",
    },
    infoSection: {
      gap: 4,
    },
    environmentLabel: {
      ...theme.text("xs", "bold", theme.colors.primary),
      letterSpacing: 2,
    },
    environmentName: {
      ...theme.text("xxl", "semibold"),
      color: theme.colors.text,
    },
    controlsSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    mainButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 30,
      gap: 10,
      ...theme.shadows.md,
    },
    mainButtonText: {
      ...theme.text("sm", "bold", theme.colors.onPrimary),
    },
    pickerTrigger: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: `${theme.colors.background}80`,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    pickerTriggerText: {
      ...theme.text("xs", "semibold", theme.colors.textSecondary),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      ...theme.text("xl", "bold"),
    },
    closeButton: {
      ...theme.text("md", "regular", theme.colors.primary),
    },
    audioOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    audioOptionSelected: {
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginHorizontal: -12,
    },
    audioOptionText: {
      ...theme.text("md", "regular"),
    },
    audioOptionTextSelected: {
      color: theme.colors.primary,
      fontFamily: theme.typography.weights.semibold,
    },
  });
