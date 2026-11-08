import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      padding: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      textAlign: "center",
    },
    description: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: theme.spacing.sm,
    },
    button: {
      minWidth: 180,
    },
  });
