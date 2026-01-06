import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    slideCard: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    slideTitle: {
      ...theme.text("xl", "bold"), // Aumentado para destaque claro
      textAlign: "center", // Centralizado para alinhar com Header e Toolbar
      marginBottom: theme.spacing.xs, // Espaço reduzido
      marginTop: theme.spacing.sm,
    },
  });
