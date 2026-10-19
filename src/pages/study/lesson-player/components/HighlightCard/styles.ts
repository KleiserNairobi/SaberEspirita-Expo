import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md + 6,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md + 6,
      paddingBottom: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}12`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}40`,
      borderRadius: theme.radius.sm,
    },
    header: {
      position: "absolute",
      top: -12,
      left: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}50`,
    },
    headerTitle: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      fontSize: 12,
    },
    highlightItem: {
      marginBottom: theme.spacing.sm + 4,
    },
    highlightTitle: {
      ...theme.readingText("sm", "bold"),
      marginBottom: 2,
    },
    highlightContent: {
      opacity: 0.95,
      marginTop: 0,
    },
  });
