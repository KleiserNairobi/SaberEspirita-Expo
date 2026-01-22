import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    iconContainer: {
      marginBottom: theme.spacing.lg,
      alignItems: "center",
    },
    title: {
      ...theme.text("xxl", "bold"),
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    body: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
      textAlign: "center",
    },
    buttonContainer: {
      width: "100%",
      gap: theme.spacing.sm,
    },
  });
}
