import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}15`,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    headerTitle: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
    highlightItem: {
      marginBottom: theme.spacing.sm,
    },
    highlightTitle: {
      ...theme.text("sm", "semibold"),
      marginBottom: 4,
    },
    highlightContent: {
      ...theme.text("sm", "regular"),
      textAlign: "justify",
      lineHeight: 20,
      opacity: 0.9,
    },
  });
