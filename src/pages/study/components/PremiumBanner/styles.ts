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
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}40`,
      zIndex: 2,
    },
    cutoutBadgeText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.warning,
      letterSpacing: 0.8,
    },
    content: {
      marginTop: 2,
    },
    title: {
      ...theme.text("md", "bold"),
      color: theme.colors.text,
      marginBottom: 4,
    },
    description: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      lineHeight: 18,
      marginBottom: 12,
    },
    actionButton: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: theme.radius.xs,
    },
    actionButtonText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.onPrimary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
  });
