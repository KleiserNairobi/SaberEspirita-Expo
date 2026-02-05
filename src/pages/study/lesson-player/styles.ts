import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.border}50`,
    },
    headerTitle: {
      ...theme.text("md", "medium"),
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: theme.spacing.md,
    },
    // Navegação inferior completa
    bottomNavigation: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.border}30`,
      backgroundColor: theme.colors.background,
    },
    // Botões de navegação (Anterior/Próximo)
    navButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    navButtonDisabled: {
      opacity: 0.4,
    },
    navButtonText: {
      ...theme.text("sm", "medium"),
      color: theme.colors.primary,
    },
    navButtonTextDisabled: {
      color: theme.colors.border,
    },
    // Indicador central
    bottomIndicatorCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end", // Alinha ao bottom para ficar na linha do texto
    },
    // Botão finalizar
    finishButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    finishButtonText: {
      ...theme.text("sm", "bold"),
      color: "#FFFFFF",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    errorText: {
      ...theme.text("lg", "medium", theme.colors.textSecondary),
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    retryButton: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
    },
    retryButtonText: {
      ...theme.text("md", "bold"),
      color: "#FFFFFF",
    },
  });
