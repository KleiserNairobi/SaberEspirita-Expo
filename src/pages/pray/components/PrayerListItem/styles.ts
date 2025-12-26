import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
      paddingVertical: 2,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
    },
    description: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
    },
  });
