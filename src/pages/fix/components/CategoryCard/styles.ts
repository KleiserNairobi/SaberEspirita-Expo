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
      alignItems: "center",
      justifyContent: "center",
      // gap: theme.spacing.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
    },
    name: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    questionCount: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      // gap: 4,
      // marginTop: theme.spacing.xs,
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
  });
}
