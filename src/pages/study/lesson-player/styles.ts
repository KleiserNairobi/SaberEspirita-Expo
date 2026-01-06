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
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.border}50`,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      ...theme.text("md", "semibold"),
      flex: 1,
      textAlign: "center",
      paddingHorizontal: theme.spacing.sm,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 100, // Garante que o conteúdo não fique atrás dos botões fixos
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
