import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: `${theme.colors.warning}15`,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
      borderRadius: theme.radius.sm,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    headerTitle: {
      ...theme.text("sm", "semibold", theme.colors.warning),
    },
    referenceText: {
      ...theme.text("sm", "regular"),
      lineHeight: 18,
      marginBottom: 4,
    },
  });
