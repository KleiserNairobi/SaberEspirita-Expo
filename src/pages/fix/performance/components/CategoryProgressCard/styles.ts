import { StyleSheet } from "react-native";
import type { ITheme } from "@/configs/theme/types";

/**
 * Estilos para o card de progresso por categoria
 */
export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoryInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    name: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
    },
    details: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    percentage: {
      ...theme.text("md", "bold"),
      color: theme.colors.text,
    },
    progressContainer: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: theme.radius.full,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.full,
    },
  });
}
