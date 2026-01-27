import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "flex-start",
      overflow: "hidden", // Garante que a imagem escalada não vaze
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
    },
    name: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      textAlign: "left",
      marginBottom: theme.spacing.xs,
    },
    questionCount: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "left",
      marginBottom: theme.spacing.sm,
    },
    progressContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    progressBackground: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    progressText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.textSecondary,
      minWidth: 32,
      textAlign: "right",
    },
    backgroundImage: {
      position: "absolute",
      right: 0, // Leve "sangria" para a direita
      top: "50%", // Centralizar verticalmente
      width: 120, // Aumentar tamanho para dar peso visual
      height: 120,
      zIndex: -1,
      opacity: 0.12, // Levemente mais visível para destacar a gravura
      transform: [{ translateY: -50 }], // Compensar metade da altura para centralizar exato
    },
  });
}
