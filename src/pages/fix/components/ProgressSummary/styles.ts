import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xxl", "regular"),
      color: theme.colors.text,
    },
    viewAllButton: {
      ...theme.text("md", "medium", theme.colors.primary),
    },
    cardsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    card: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    value: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
    },
    label: {
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginTop: 2,
    },
  });
}
