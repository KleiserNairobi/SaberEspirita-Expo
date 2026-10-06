import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      backgroundColor: `${theme.colors.warning}10`,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}40`,
      padding: theme.spacing.md,
    },
    cutoutBadge: {
      position: "absolute",
      top: -12,
      left: 14,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}40`,
      zIndex: 2,
    },
    cutoutBadgeText: {
      ...theme.text("xs", "semibold", theme.colors.warning),
      letterSpacing: 0.8,
    },
    content: {
      marginTop: theme.spacing.xs / 2,
    },
    title: {
      ...theme.text("md", "bold"),
      marginBottom: theme.spacing.xs,
    },
    description: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      lineHeight: 18,
      marginBottom: theme.spacing.sm,
    },
    actionButton: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.xs,
    },
    actionButtonText: {
      ...theme.text("xs", "semibold", theme.colors.onPrimary),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
  });
