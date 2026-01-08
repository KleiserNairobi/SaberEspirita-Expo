import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg, // Alinhado com o padding da tela
      paddingVertical: theme.spacing.md,
      // backgroundColor: theme.colors.card, // Removido fundo card
      // borderBottomWidth: 1, // Removida borda
      // borderBottomColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm, // Mais espaço entre texto e barra
    },
    title: {
      ...theme.text("sm", "medium"),
      color: theme.colors.text,
      marginBottom: 2,
    },
    counter: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.textSecondary, // Mais discreto
    },
    progressBackground: {
      height: 6, // Mais visível
      backgroundColor: theme.colors.border, // Track
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
  });
}
