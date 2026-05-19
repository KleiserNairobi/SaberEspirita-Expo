import { StyleSheet } from "react-native";
import type { ITheme } from "@/configs/theme/types";

/**
 * Estilos para o componente de visão geral de estatísticas
 */
export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    title: {
      ...theme.text("xxl", "regular"),
      color: theme.colors.text,
    },
    viewAllButton: {
      ...theme.text("md", "medium", theme.colors.primary),
    },
    grid: {
      gap: theme.spacing.md,
    },
    row: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    card: {
      flex: 1,
    },
  });
}
