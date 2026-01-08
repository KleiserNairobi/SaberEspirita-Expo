import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: {
      flex: 1,
    },
    title: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    questionCount: {
      ...theme.text("xs", "medium"),
      color: theme.colors.muted,
    },
    iconContainer: {
      marginLeft: theme.spacing.sm,
    },
  });
}
