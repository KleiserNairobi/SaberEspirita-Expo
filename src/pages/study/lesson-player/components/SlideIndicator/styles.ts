import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    dotsContainer: {
      flexDirection: "row",
      gap: 6,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
    },
    dotInactive: {
      backgroundColor: theme.colors.border,
    },
    counter: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
    },
  });
