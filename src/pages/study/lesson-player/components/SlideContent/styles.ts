import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    slideCard: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    slideTypeBadge: {
      alignSelf: "flex-start",
      backgroundColor: `${theme.colors.primary}15`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    slideTypeText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    slideTitle: {
      ...theme.text("xl", "bold"),
      textAlign: "left",
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
  });
